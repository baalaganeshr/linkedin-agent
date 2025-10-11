// Authentication middleware for LinkedInScholar
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token middleware
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : req.header('x-auth-token');

    // Check if no token
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided, authorization denied'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user by ID and check if account is active
      const user = await User.findById(decoded.userId).select('-tokens');
      
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Token is valid but user not found'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          status: 'error',
          message: 'Account has been deactivated'
        });
      }

      // Update last active timestamp
      user.usage.lastActive = new Date();
      await user.save();

      // Add user to request object
      req.user = user;
      next();

    } catch (tokenError) {
      if (tokenError.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token has expired',
          code: 'TOKEN_EXPIRED'
        });
      }

      if (tokenError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid token format',
          code: 'INVALID_TOKEN'
        });
      }

      throw tokenError;
    }

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authentication error occurred'
    });
  }
};

// Check if user is premium
const requirePremium = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    if (!req.user.isPremium()) {
      return res.status(403).json({
        status: 'error',
        message: 'Premium subscription required',
        code: 'PREMIUM_REQUIRED',
        upgradeUrl: `${process.env.FRONTEND_URL}/upgrade`
      });
    }

    next();
  } catch (error) {
    console.error('Premium middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Premium check failed'
    });
  }
};

// Check feature usage limits for free users
const checkUsageLimit = (featureType, limit = null) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required'
        });
      }

      // Premium users have unlimited access
      if (req.user.isPremium()) {
        return next();
      }

      // Check if user can use this feature
      if (!req.user.canUseFeature(featureType)) {
        const featureLimits = {
          resumesGenerated: 3,
          profileOptimizations: 5,
          networkingSuggestions: 10
        };

        return res.status(403).json({
          status: 'error',
          message: `Free plan limit reached for ${featureType}`,
          code: 'USAGE_LIMIT_EXCEEDED',
          data: {
            feature: featureType,
            limit: limit || featureLimits[featureType],
            current: req.user.usage[featureType] || 0,
            upgradeUrl: `${process.env.FRONTEND_URL}/upgrade`
          }
        });
      }

      next();
    } catch (error) {
      console.error('Usage limit middleware error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Usage limit check failed'
      });
    }
  };
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : req.header('x-auth-token');

    if (!token) {
      // No token provided, continue without authentication
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-tokens');
      
      if (user && user.isActive) {
        req.user = user;
        // Update last active
        user.usage.lastActive = new Date();
        await user.save();
      } else {
        req.user = null;
      }
    } catch (tokenError) {
      // Invalid token, but continue without authentication
      req.user = null;
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    req.user = null;
    next();
  }
};

// Admin role check (for future admin features)
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Check if user has admin role (add to User model if needed)
    if (!req.user.isAdmin) {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Admin check failed'
    });
  }
};

// Rate limiting per user
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const userRequests = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (userRequests.has(userId)) {
      const userReqs = userRequests.get(userId);
      userRequests.set(userId, userReqs.filter(time => time > windowStart));
    } else {
      userRequests.set(userId, []);
    }

    const userReqs = userRequests.get(userId);

    if (userReqs.length >= maxRequests) {
      return res.status(429).json({
        status: 'error',
        message: 'Too many requests from this user',
        retryAfter: Math.ceil(windowMs / 1000),
        code: 'USER_RATE_LIMIT_EXCEEDED'
      });
    }

    userReqs.push(now);
    next();
  };
};

module.exports = {
  auth,
  requirePremium,
  checkUsageLimit,
  optionalAuth,
  requireAdmin,
  userRateLimit
};