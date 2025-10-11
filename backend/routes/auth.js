// Authentication routes for LinkedIn OAuth 2.0
const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// LinkedIn OAuth configuration
const LINKEDIN_CONFIG = {
  clientId: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  redirectUri: process.env.LINKEDIN_REDIRECT_URI,
  scope: 'r_liteprofile r_emailaddress w_member_social',
  baseAuthUrl: 'https://www.linkedin.com/oauth/v2/authorization',
  tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
  profileUrl: 'https://api.linkedin.com/v2/people/~:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))',
  emailUrl: 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))'
};

// @route   GET /api/auth/linkedin/authorize
// @desc    Get LinkedIn OAuth authorization URL
// @access  Public
router.get('/linkedin/authorize', (req, res) => {
  try {
    const state = Math.random().toString(36).substring(7); // CSRF protection
    
    const authUrl = new URL(LINKEDIN_CONFIG.baseAuthUrl);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', LINKEDIN_CONFIG.clientId);
    authUrl.searchParams.append('redirect_uri', LINKEDIN_CONFIG.redirectUri);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('scope', LINKEDIN_CONFIG.scope);

    res.json({
      status: 'success',
      authUrl: authUrl.toString(),
      state
    });
  } catch (error) {
    console.error('LinkedIn auth URL generation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate authorization URL'
    });
  }
});

// @route   GET /api/auth/linkedin/callback
// @desc    Handle LinkedIn OAuth callback
// @access  Public
router.get('/linkedin/callback', async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;

    // Handle OAuth errors
    if (error) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(error_description || error)}`);
    }

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=No authorization code received`);
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(LINKEDIN_CONFIG.tokenUrl, null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: LINKEDIN_CONFIG.redirectUri,
        client_id: LINKEDIN_CONFIG.clientId,
        client_secret: LINKEDIN_CONFIG.clientSecret
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, expires_in } = tokenResponse.data;

    // Get user profile from LinkedIn
    const [profileResponse, emailResponse] = await Promise.all([
      axios.get(LINKEDIN_CONFIG.profileUrl, {
        headers: { Authorization: `Bearer ${access_token}` }
      }),
      axios.get(LINKEDIN_CONFIG.emailUrl, {
        headers: { Authorization: `Bearer ${access_token}` }
      })
    ]);

    const profile = profileResponse.data;
    const emailData = emailResponse.data;

    // Extract user information
    const linkedinId = profile.id;
    const firstName = profile.firstName?.localized?.en_US || profile.firstName?.preferredLocale?.language || '';
    const lastName = profile.lastName?.localized?.en_US || profile.lastName?.preferredLocale?.language || '';
    const email = emailData.elements?.[0]?.['handle~']?.emailAddress;
    const profilePicture = profile.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier;

    if (!email) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=Email permission required`);
    }

    // Find or create user
    let user = await User.findOne({ linkedinId });

    if (user) {
      // Update existing user
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.profilePicture = profilePicture;
      user.lastLoginDate = new Date();
      user.lastLoginIP = req.ip;
      user.tokens = {
        accessToken: access_token,
        tokenExpiry: new Date(Date.now() + expires_in * 1000)
      };
    } else {
      // Create new user
      user = new User({
        linkedinId,
        firstName,
        lastName,
        email,
        profilePicture,
        lastLoginDate: new Date(),
        lastLoginIP: req.ip,
        tokens: {
          accessToken: access_token,
          tokenExpiry: new Date(Date.now() + expires_in * 1000)
        }
      });
    }

    await user.save();

    // Generate JWT token
    const jwtToken = jwt.sign(
      { 
        userId: user._id,
        linkedinId: user.linkedinId 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${jwtToken}&user=${encodeURIComponent(JSON.stringify({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.profilePicture,
      subscription: user.subscription
    }))}`);

  } catch (error) {
    console.error('LinkedIn callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-tokens');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        user,
        isPremium: user.isPremium(),
        subscriptionDaysRemaining: user.subscriptionDaysRemaining,
        usageLimits: {
          resumesGenerated: {
            current: user.usage.resumesGenerated,
            limit: user.isPremium() ? 'unlimited' : 3,
            canUse: user.canUseFeature('resumesGenerated')
          },
          profileOptimizations: {
            current: user.usage.profileOptimizations,
            limit: user.isPremium() ? 'unlimited' : 5,
            canUse: user.canUseFeature('profileOptimizations')
          },
          networkingSuggestions: {
            current: user.usage.networkingSuggestions,
            limit: user.isPremium() ? 'unlimited' : 10,
            canUse: user.canUseFeature('networkingSuggestions')
          }
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user profile'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('firstName').optional().trim().isLength({ min: 1, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 1, max: 50 }),
  body('studentInfo.college').optional().trim().isLength({ max: 100 }),
  body('studentInfo.fieldOfStudy').optional().trim().isLength({ max: 100 }),
  body('studentInfo.graduationYear').optional().isInt({ min: 2020, max: 2030 }),
  body('studentInfo.currentYear').optional().isIn(['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year', 'Graduate']),
  body('preferences.emailNotifications').optional().isBoolean(),
  body('preferences.weeklyTips').optional().isBoolean(),
  body('preferences.networkingReminders').optional().isBoolean(),
  body('preferences.theme').optional().isIn(['dark', 'light', 'auto'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const allowedUpdates = [
      'firstName', 'lastName', 'studentInfo', 'preferences'
    ];

    const updates = {};
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-tokens');

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (invalidate token on client side)
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    // Update last active time
    await User.findByIdAndUpdate(req.user._id, {
      'usage.lastActive': new Date()
    });

    res.json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Logout failed'
    });
  }
});

// @route   DELETE /api/auth/account
// @desc    Delete user account
// @access  Private
router.delete('/account', auth, async (req, res) => {
  try {
    // Soft delete - deactivate account
    await User.findByIdAndUpdate(req.user._id, {
      isActive: false,
      email: `deleted_${Date.now()}_${req.user.email}` // Prevent email conflicts
    });

    res.json({
      status: 'success',
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete account'
    });
  }
});

// @route   GET /api/auth/health
// @desc    Health check for auth service
// @access  Public
router.get('/health', optionalAuth, (req, res) => {
  res.json({
    status: 'success',
    message: 'Auth service is running',
    authenticated: !!req.user,
    timestamp: new Date(),
    linkedin: {
      configured: !!(LINKEDIN_CONFIG.clientId && LINKEDIN_CONFIG.clientSecret)
    }
  });
});

module.exports = router;