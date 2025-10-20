// Networking routes WITHOUT authentication (for testing/development)
const express = require('express');
const { body, validationResult } = require('express-validator');
const aiService = require('../services/aiService');
const router = express.Router();

// Validation middleware
const validateNetworkingInput = [
  body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
  body('targetRole').trim().notEmpty().withMessage('Target role is required'),
  body('targetIndustry').optional().trim().notEmpty().withMessage('Target industry cannot be empty'),
  body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
  body('country').optional().isIn(['US', 'UK', 'CA', 'IN', 'DE', 'AU', 'FR', 'SG', 'AE', 'NL', 'SE', 'IE', 'NZ', 'JP', 'BR', 'India', 'global']).withMessage('Invalid country'),
];

const validateMessageInput = [
  body('userFullName').optional().trim().notEmpty().withMessage('User full name cannot be empty'),
  body('targetName').trim().notEmpty().withMessage('Target name is required'),
  body('targetRole').trim().notEmpty().withMessage('Target role is required'),
  body('targetCompany').optional().trim().notEmpty().withMessage('Target company cannot be empty'),
  body('context').optional().trim().notEmpty().withMessage('Context cannot be empty'),
];

/**
 * Get networking suggestions (NO AUTH - for testing)
 * POST /api/networking-test/suggestions
 */
router.post('/suggestions', validateNetworkingInput, async (req, res) => {
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
    const userProfile = {
      fullName: req.body.fullName || 'John Doe',
      targetRole: req.body.targetRole || 'Software Developer',
      targetIndustry: req.body.targetIndustry || 'Technology',
      location: req.body.location || 'India',
      country: req.body.country || 'India',
      education: req.body.education || [],
      skills: req.body.skills || [],
      experience: req.body.experience || []
    };
    
    console.log('🚀 Generating networking suggestions for:', userProfile.fullName);
    console.log('🎯 Target Role:', userProfile.targetRole);
    console.log('🏢 Industry:', userProfile.targetIndustry);
    console.log('📍 Location:', userProfile.location);
    
    // Generate networking suggestions using AI
    const suggestions = await aiService.generateNetworkingSuggestions(
      userProfile,
      userProfile.targetRole
    );
    
    res.json({
      success: true,
      message: 'Networking suggestions generated successfully!',
      suggestions: suggestions,
      targetRole: userProfile.targetRole,
      personalizedFor: userProfile.fullName
    });
    
  } catch (error) {
    console.error('❌ Networking suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate networking suggestions',
      details: error.message
    });
  }
});

/**
 * Generate connection message (NO AUTH - for testing)
 * POST /api/networking-test/message
 */
router.post('/message', validateMessageInput, async (req, res) => {
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
    const userProfile = {
      fullName: req.body.userFullName || 'John Doe',
      headline: req.body.userHeadline || 'Student',
      education: req.body.userEducation || [],
      skills: req.body.userSkills || []
    };
    
    const targetProfile = {
      name: req.body.targetName || 'Jane Smith',
      role: req.body.targetRole || 'Senior Developer',
      company: req.body.targetCompany || 'Tech Company'
    };
    
    const context = req.body.context || 'general networking';
    
    console.log(`🚀 Generating message from ${userProfile.fullName} to ${targetProfile.name}`);
    
    // Generate connection message using AI
    const messages = await aiService.generateConnectionMessage(
      targetProfile,
      userProfile,
      context
    );
    
    res.json({
      success: true,
      message: 'Connection message generated successfully!',
      messages: messages,
      from: userProfile.fullName,
      to: targetProfile.name
    });
    
  } catch (error) {
    console.error('❌ Message generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate message',
      details: error.message
    });
  }
});

module.exports = router;
