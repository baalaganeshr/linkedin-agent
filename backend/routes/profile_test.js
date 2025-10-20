// Profile optimization routes WITHOUT authentication (for testing/development)
const express = require('express');
const { body, validationResult } = require('express-validator');
const aiService = require('../services/aiService');
const router = express.Router();

// Validation middleware
const validateProfileInput = [
  body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
  body('headline').optional().trim().isLength({ max: 220 }).withMessage('Headline must be less than 220 characters'),
  body('summary').optional().trim().isLength({ max: 2600 }).withMessage('Summary must be less than 2600 characters'),
  body('targetRole').trim().notEmpty().withMessage('Target role is required'),
  body('country').optional().isIn(['US', 'UK', 'CA', 'IN', 'DE', 'AU', 'FR', 'SG', 'AE', 'NL', 'SE', 'IE', 'NZ', 'JP', 'BR', 'India', 'global']).withMessage('Invalid country'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
];

/**
 * Optimize LinkedIn profile (NO AUTH - for testing)
 * POST /api/profile-test/optimize
 */
router.post('/optimize', validateProfileInput, async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(e => e.msg).join(', ')
    });
  }
  try {
    const profileData = {
      fullName: req.body.fullName || 'John Doe',
      headline: req.body.headline || 'Student',
      summary: req.body.summary || '',
      targetRole: req.body.targetRole || 'Software Developer',
      country: req.body.country || 'India',
      experience: req.body.experience || [],
      education: req.body.education || [],
      skills: req.body.skills || []
    };
    
    console.log('🚀 Optimizing profile for:', profileData.fullName);
    console.log('🎯 Target Role:', profileData.targetRole);
    console.log('📍 Country:', profileData.country);
    
    // Get optimization suggestions using AI
    const optimization = await aiService.optimizeProfile(profileData);
    
    res.json({
      success: true,
      message: 'Profile optimized successfully!',
      optimization: optimization,
      profileName: profileData.fullName
    });
    
  } catch (error) {
    console.error('❌ Profile optimization error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to optimize profile',
      details: error.message
    });
  }
});

module.exports = router;
