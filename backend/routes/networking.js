// Networking suggestions and AI-powered connection routes
const express = require('express');
const { body, validationResult, param } = require('express-validator');
const aiService = require('../services/aiService');
const NetworkingSuggestion = require('../models/NetworkingSuggestion');
const User = require('../models/User');
const { auth, checkUsageLimit } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/networking/suggestions
// @desc    Generate AI-powered networking suggestions
// @access  Private (with usage limits for free users)
router.post('/suggestions', [
  auth,
  checkUsageLimit('networkingSuggestions'),
  body('preferences').optional().isObject().withMessage('Preferences must be an object'),
  body('preferences.targetIndustry').optional().trim().isLength({ min: 2, max: 100 }),
  body('preferences.careerGoals').optional().trim().isLength({ max: 200 }),
  body('preferences.networkingGoals').optional().trim().isLength({ max: 200 }),
  body('count').optional().isInt({ min: 1, max: 20 }).withMessage('Count must be between 1 and 20')
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

    const { preferences = {}, count = 10 } = req.body;
    const user = req.user;

    // Generate networking suggestions using AI
    const aiResult = await aiService.generateNetworkingSuggestions(user, preferences);

    if (!aiResult.success) {
      return res.status(500).json({
        status: 'error',
        message: 'AI networking suggestions failed'
      });
    }

    const { connectionTargets, messageTemplates, engagementStrategy, communityRecommendations } = aiResult.data;

    // Create networking suggestion documents
    const suggestions = [];
    
    // Process connection targets
    for (let i = 0; i < Math.min(connectionTargets.length, count); i++) {
      const target = connectionTargets[i];
      
      const suggestion = new NetworkingSuggestion({
        userId: user._id,
        type: 'connection_request',
        priority: target.priority || 'medium',
        target: {
          name: target.title || 'Professional',
          title: target.title || '',
          company: target.company || '',
          industry: preferences.targetIndustry || user.studentInfo?.fieldOfStudy || 'Technology'
        },
        suggestion: {
          title: `Connect with ${target.title}`,
          description: target.reasoning || `Networking opportunity in ${target.company}`,
          reasoning: target.reasoning || 'Relevant professional connection',
          actionItems: [`Send connection request`, `Personalize message`],
          expectedOutcome: 'Expand professional network and gain industry insights'
        },
        messageTemplate: {
          subject: `Connection Request - ${user.firstName} ${user.lastName}`,
          body: messageTemplates[0]?.template || `Hi, I'm a ${user.studentInfo?.currentYear} ${user.studentInfo?.fieldOfStudy} student interested in connecting with professionals in ${preferences.targetIndustry}. I'd love to learn from your experience.`,
          tone: 'professional',
          personalization: ['Mention specific company/role', 'Reference mutual interests', 'Be genuine and brief']
        },
        relevanceScore: {
          overall: Math.floor(Math.random() * 30) + 70, // 70-100 range
          factors: {
            industryMatch: Math.floor(Math.random() * 20) + 80,
            skillsMatch: Math.floor(Math.random() * 20) + 70,
            locationProximity: Math.floor(Math.random() * 30) + 50,
            careerLevel: Math.floor(Math.random() * 20) + 75,
            mutualConnections: Math.floor(Math.random() * 40) + 30,
            activityLevel: Math.floor(Math.random() * 30) + 60
          }
        },
        aiMetadata: {
          model: 'gemini-pro',
          generatedAt: new Date(),
          confidence: 0.8 + Math.random() * 0.2 // 0.8-1.0 range
        },
        tags: [preferences.targetIndustry, 'student-networking', target.priority].filter(Boolean)
      });

      suggestions.push(suggestion);
    }

    // Save suggestions to database
    const savedSuggestions = await NetworkingSuggestion.insertMany(suggestions);

    // Increment user usage
    await user.incrementUsage('networkingSuggestions');

    res.status(201).json({
      status: 'success',
      message: 'Networking suggestions generated successfully',
      data: {
        suggestions: savedSuggestions,
        strategies: {
          engagement: engagementStrategy,
          communities: communityRecommendations,
          messageTemplates: messageTemplates
        },
        metadata: aiResult.metadata,
        usage: {
          current: user.usage.networkingSuggestions + 1,
          limit: user.isPremium() ? 'unlimited' : 10
        }
      }
    });

  } catch (error) {
    console.error('Networking suggestions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate networking suggestions',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/networking/suggestions
// @desc    Get user's networking suggestions
// @access  Private
router.get('/suggestions', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      priority, 
      status = 'pending',
      sortBy = 'relevanceScore.overall',
      sortOrder = 'desc' 
    } = req.query;

    const filter = {
      userId: req.user._id,
      'timing.expiresAt': { $gt: new Date() }
    };

    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [suggestions, total] = await Promise.all([
      NetworkingSuggestion.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      NetworkingSuggestion.countDocuments(filter)
    ]);

    res.json({
      status: 'success',
      data: {
        suggestions,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        },
        filters: {
          type: type || 'all',
          priority: priority || 'all',
          status: status || 'all'
        }
      }
    });

  } catch (error) {
    console.error('Get networking suggestions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch networking suggestions'
    });
  }
});

// @route   GET /api/networking/suggestions/:id
// @desc    Get specific networking suggestion
// @access  Private
router.get('/suggestions/:id', [
  auth,
  param('id').isMongoId().withMessage('Invalid suggestion ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid suggestion ID'
      });
    }

    const suggestion = await NetworkingSuggestion.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!suggestion) {
      return res.status(404).json({
        status: 'error',
        message: 'Networking suggestion not found'
      });
    }

    // Mark as viewed
    await suggestion.markAsViewed();

    res.json({
      status: 'success',
      data: { suggestion }
    });

  } catch (error) {
    console.error('Get networking suggestion error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch networking suggestion'
    });
  }
});

// @route   POST /api/networking/suggestions/:id/action
// @desc    Record action taken on networking suggestion
// @access  Private
router.post('/suggestions/:id/action', [
  auth,
  param('id').isMongoId().withMessage('Invalid suggestion ID'),
  body('actionType').isIn(['sent_request', 'sent_message', 'followed', 'endorsed', 'none']).withMessage('Invalid action type'),
  body('success').optional().isBoolean().withMessage('Success must be boolean'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes too long')
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

    const { actionType, success = false, notes } = req.body;

    const suggestion = await NetworkingSuggestion.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!suggestion) {
      return res.status(404).json({
        status: 'error',
        message: 'Networking suggestion not found'
      });
    }

    // Record the action
    await suggestion.recordAction(actionType, success);

    // Add notes if provided
    if (notes) {
      suggestion.userInteraction.feedback = notes;
      await suggestion.save();
    }

    res.json({
      status: 'success',
      message: 'Action recorded successfully',
      data: { 
        suggestion,
        actionTaken: actionType,
        success
      }
    });

  } catch (error) {
    console.error('Record networking action error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to record action'
    });
  }
});

// @route   POST /api/networking/suggestions/:id/rate
// @desc    Rate networking suggestion
// @access  Private
router.post('/suggestions/:id/rate', [
  auth,
  param('id').isMongoId().withMessage('Invalid suggestion ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').optional().trim().isLength({ max: 500 }).withMessage('Feedback too long')
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

    const { rating, feedback = '' } = req.body;

    const suggestion = await NetworkingSuggestion.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!suggestion) {
      return res.status(404).json({
        status: 'error',
        message: 'Networking suggestion not found'
      });
    }

    await suggestion.rateSuggestion(rating, feedback);

    res.json({
      status: 'success',
      message: 'Rating submitted successfully',
      data: { 
        suggestion,
        rating,
        feedback
      }
    });

  } catch (error) {
    console.error('Rate networking suggestion error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit rating'
    });
  }
});

// @route   POST /api/networking/message-generator
// @desc    Generate personalized connection message
// @access  Private
router.post('/message-generator', [
  auth,
  body('targetPerson').isObject().withMessage('Target person data is required'),
  body('targetPerson.name').trim().isLength({ min: 2, max: 100 }).withMessage('Valid name is required'),
  body('targetPerson.title').optional().trim().isLength({ max: 100 }),
  body('targetPerson.company').optional().trim().isLength({ max: 100 }),
  body('context').optional().trim().isLength({ max: 300 }).withMessage('Context too long')
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

    const { targetPerson, context = '' } = req.body;
    const user = req.user;

    // Generate personalized message using AI
    const aiResult = await aiService.generateConnectionMessage(targetPerson, user, context);

    if (!aiResult.success) {
      return res.status(500).json({
        status: 'error',
        message: 'AI message generation failed'
      });
    }

    res.json({
      status: 'success',
      message: 'Connection messages generated successfully',
      data: {
        messages: aiResult.data.messages,
        personalizationTips: aiResult.data.personalizationTips,
        timing: aiResult.data.timing,
        followUp: aiResult.data.followUp,
        metadata: aiResult.metadata
      }
    });

  } catch (error) {
    console.error('Message generator error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate connection message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/networking/analytics
// @desc    Get networking analytics and success stats
// @access  Private
router.get('/analytics', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const userId = req.user._id;

    // Get success stats from the static method
    const successStats = await NetworkingSuggestion.getSuccessStats(userId, parseInt(days));

    // Get overall analytics
    const overallStats = await NetworkingSuggestion.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalSuggestions: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          actedUpon: { $sum: { $cond: [{ $eq: ['$status', 'acted_upon'] }, 1, 0] } },
          successful: { $sum: { $cond: ['$userInteraction.success', 1, 0] } },
          avgRating: { $avg: '$userInteraction.rating' },
          avgRelevance: { $avg: '$relevanceScore.overall' },
          totalViews: { $sum: '$userInteraction.viewCount' }
        }
      }
    ]);

    const stats = overallStats[0] || {
      totalSuggestions: 0,
      pending: 0,
      actedUpon: 0,
      successful: 0,
      avgRating: 0,
      avgRelevance: 0,
      totalViews: 0
    };

    // Calculate rates
    const actionRate = stats.totalSuggestions > 0 ? (stats.actedUpon / stats.totalSuggestions) * 100 : 0;
    const successRate = stats.actedUpon > 0 ? (stats.successful / stats.actedUpon) * 100 : 0;

    res.json({
      status: 'success',
      data: {
        overview: {
          ...stats,
          actionRate: Math.round(actionRate * 100) / 100,
          successRate: Math.round(successRate * 100) / 100
        },
        byType: successStats,
        period: `${days} days`,
        user: {
          usage: req.user.usage,
          isPremium: req.user.isPremium(),
          subscriptionDaysRemaining: req.user.subscriptionDaysRemaining
        }
      }
    });

  } catch (error) {
    console.error('Networking analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch networking analytics'
    });
  }
});

// @route   DELETE /api/networking/cleanup
// @desc    Cleanup expired suggestions (admin/maintenance)
// @access  Private
router.delete('/cleanup', auth, async (req, res) => {
  try {
    const result = await NetworkingSuggestion.cleanupExpired();

    res.json({
      status: 'success',
      message: 'Expired suggestions cleaned up',
      data: {
        modifiedCount: result.modifiedCount
      }
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to cleanup expired suggestions'
    });
  }
});

module.exports = router;