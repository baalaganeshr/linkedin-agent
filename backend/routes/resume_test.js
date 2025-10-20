// Resume routes WITHOUT authentication (for testing/development)
const express = require('express');
const { body, validationResult } = require('express-validator');
const aiService = require('../services/aiService');
const logger = require('../config/logger');
const router = express.Router();

// Validation middleware
const validateResumeInput = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('targetRole').trim().notEmpty().withMessage('Target role is required'),
  body('country').optional().isIn(['US', 'UK', 'CA', 'IN', 'DE', 'AU', 'FR', 'SG', 'AE', 'NL', 'SE', 'IE', 'NZ', 'JP', 'BR', 'India', 'global']).withMessage('Invalid country'),
  body('skills.technical').optional().isArray().withMessage('Technical skills must be an array'),
  body('skills.soft').optional().isArray().withMessage('Soft skills must be an array'),
  body('experience').optional().isArray().withMessage('Experience must be an array'),
  body('education').optional().isArray().withMessage('Education must be an array'),
  body('projects').optional().isArray().withMessage('Projects must be an array'),
];

/**
 * Generate AI-powered resume (NO AUTH - for testing)
 * POST /api/resume-test/generate
 */
router.post('/generate', validateResumeInput, async (req, res) => {
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
      email: req.body.email || 'john@example.com',
      phone: req.body.phone || '',
      linkedin: req.body.linkedin || '',
      country: req.body.country || 'India',
      targetRole: req.body.targetRole || 'Software Developer',
      skills: req.body.skills || { technical: [], soft: [] },
      experience: req.body.experience || [],
      education: req.body.education || [],
      projects: req.body.projects || []
    };
    
    // Log request without PII
    logger.info('Resume generation request', {
      targetRole: profileData.targetRole,
      country: profileData.country,
      hasExperience: profileData.experience?.length > 0,
      hasEducation: profileData.education?.length > 0,
      hasProjects: profileData.projects?.length > 0
    });
    
    // Generate resume using AI
    const resumeContent = await aiService.generateResume(profileData);
    
    res.json({
      success: true,
      message: 'Resume generated successfully!',
      resume: resumeContent,
      generatedFor: profileData.fullName,
      targetRole: profileData.targetRole
    });
    
  } catch (error) {
    logger.error('Resume generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate resume',
      details: error.message
    });
  }
});

module.exports = router;
