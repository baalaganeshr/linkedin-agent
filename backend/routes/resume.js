// Resume generation and management routes
const express = require('express');
const { body, validationResult, param } = require('express-validator');
const aiService = require('../services/aiService');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { auth, checkUsageLimit } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/resume/generate
// @desc    Generate AI-powered resume
// @access  Private (with usage limits for free users)
router.post('/generate', [
  auth,
  checkUsageLimit('resumesGenerated'),
  body('targetRole').trim().isLength({ min: 2, max: 100 }).withMessage('Target role is required'),
  body('targetIndustry').trim().isLength({ min: 2, max: 100 }).withMessage('Target industry is required'),
  body('experience').optional().isArray().withMessage('Experience must be an array'),
  body('projects').optional().isArray().withMessage('Projects must be an array'),
  body('skills').optional().isObject().withMessage('Skills must be an object'),
  body('template').optional().isIn(['modern', 'classic', 'creative', 'minimal']).withMessage('Invalid template')
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

    const { targetRole, targetIndustry, experience = [], projects = [], skills = {}, template = 'modern' } = req.body;
    const user = req.user;

    // Prepare experience data for AI
    const allExperience = [
      ...experience,
      ...projects.map(project => ({
        company: 'Personal Project',
        position: 'Developer',
        description: project.description,
        technologies: project.technologies || [],
        achievements: project.achievements || []
      }))
    ];

    // Generate resume using AI
    const aiResult = await aiService.generateResume(
      user,
      targetRole,
      targetIndustry,
      allExperience
    );

    if (!aiResult.success) {
      return res.status(500).json({
        status: 'error',
        message: 'AI resume generation failed'
      });
    }

    // Create resume document
    const resumeData = {
      userId: user._id,
      title: `${targetRole} Resume`,
      personalInfo: {
        fullName: user.fullName,
        email: user.email,
        linkedinUrl: user.linkedinProfile?.publicProfileUrl || '',
        location: user.linkedinProfile?.location || ''
      },
      summary: aiResult.data.summary,
      education: aiResult.data.education || [{
        institution: user.studentInfo?.college || 'Your College',
        degree: 'Bachelor\'s Degree',
        fieldOfStudy: user.studentInfo?.fieldOfStudy || 'Computer Science',
        startDate: new Date(new Date().getFullYear() - 4, 8, 1),
        endDate: new Date(user.studentInfo?.graduationYear || new Date().getFullYear(), 5, 31),
        achievements: [],
        relevantCoursework: []
      }],
      experience: aiResult.data.experience || [],
      projects: aiResult.data.projects || [],
      skills: {
        technical: aiResult.data.skills?.technical || [],
        soft: aiResult.data.skills?.soft || [],
        languages: [{ language: 'English', proficiency: 'Advanced' }],
        certifications: []
      },
      aiData: {
        generationPrompt: `${targetRole} in ${targetIndustry}`,
        targetRole,
        targetIndustry,
        keywordOptimization: aiResult.data.keywordOptimization || [],
        atsScore: aiResult.data.atsScore || 75,
        improvements: aiResult.data.improvements || [],
        generatedAt: new Date(),
        modelUsed: 'gemini-pro'
      },
      template: {
        name: template,
        colorScheme: 'purple',
        fontSize: 'medium'
      }
    };

    const resume = new Resume(resumeData);
    await resume.save();

    // Increment user usage
    await user.incrementUsage('resumesGenerated');

    res.status(201).json({
      status: 'success',
      message: 'Resume generated successfully',
      data: {
        resume,
        aiMetadata: aiResult.metadata,
        usage: {
          current: user.usage.resumesGenerated + 1,
          limit: user.isPremium() ? 'unlimited' : 3
        }
      }
    });

  } catch (error) {
    console.error('Resume generation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate resume',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/resume/list
// @desc    Get user's resumes
// @access  Private
router.get('/list', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'updatedAt', sortOrder = 'desc' } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [resumes, total] = await Promise.all([
      Resume.find({ userId: req.user._id, isActive: true })
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-aiData.generationPrompt'), // Exclude large fields
      Resume.countDocuments({ userId: req.user._id, isActive: true })
    ]);

    res.json({
      status: 'success',
      data: {
        resumes,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Resume list error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch resumes'
    });
  }
});

// @route   GET /api/resume/:id
// @desc    Get specific resume
// @access  Private
router.get('/:id', [
  auth,
  param('id').isMongoId().withMessage('Invalid resume ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid resume ID'
      });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true
    });

    if (!resume) {
      return res.status(404).json({
        status: 'error',
        message: 'Resume not found'
      });
    }

    // Increment view count
    await resume.incrementView();

    res.json({
      status: 'success',
      data: { resume }
    });

  } catch (error) {
    console.error('Resume fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch resume'
    });
  }
});

// @route   PUT /api/resume/:id
// @desc    Update resume
// @access  Private
router.put('/:id', [
  auth,
  param('id').isMongoId().withMessage('Invalid resume ID'),
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('summary').optional().trim().isLength({ min: 10, max: 500 }),
  body('experience').optional().isArray(),
  body('projects').optional().isArray(),
  body('skills').optional().isObject(),
  body('template').optional().isObject()
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
      'title', 'summary', 'experience', 'projects', 'skills', 
      'template', 'personalInfo', 'education', 'volunteering', 'awards'
    ];

    const updates = {};
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
        isActive: true
      },
      updates,
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({
        status: 'error',
        message: 'Resume not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Resume updated successfully',
      data: { resume }
    });

  } catch (error) {
    console.error('Resume update error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update resume'
    });
  }
});

// @route   DELETE /api/resume/:id
// @desc    Delete resume (soft delete)
// @access  Private
router.delete('/:id', [
  auth,
  param('id').isMongoId().withMessage('Invalid resume ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid resume ID'
      });
    }

    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
        isActive: true
      },
      { isActive: false },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({
        status: 'error',
        message: 'Resume not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Resume deleted successfully'
    });

  } catch (error) {
    console.error('Resume deletion error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete resume'
    });
  }
});

// @route   POST /api/resume/:id/duplicate
// @desc    Duplicate resume
// @access  Private
router.post('/:id/duplicate', [
  auth,
  checkUsageLimit('resumesGenerated'),
  param('id').isMongoId().withMessage('Invalid resume ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid resume ID'
      });
    }

    const originalResume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true
    });

    if (!originalResume) {
      return res.status(404).json({
        status: 'error',
        message: 'Resume not found'
      });
    }

    // Create duplicate
    const duplicateData = originalResume.toObject();
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    
    duplicateData.title = `${duplicateData.title} (Copy)`;
    duplicateData.version = 1;
    duplicateData.analytics = {
      views: 0,
      downloads: 0
    };

    const duplicate = new Resume(duplicateData);
    await duplicate.save();

    // Increment user usage
    await req.user.incrementUsage('resumesGenerated');

    res.status(201).json({
      status: 'success',
      message: 'Resume duplicated successfully',
      data: { resume: duplicate }
    });

  } catch (error) {
    console.error('Resume duplication error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to duplicate resume'
    });
  }
});

// @route   GET /api/resume/:id/export/:format
// @desc    Export resume in different formats
// @access  Private
router.get('/:id/export/:format', [
  auth,
  param('id').isMongoId().withMessage('Invalid resume ID'),
  param('format').isIn(['pdf', 'docx', 'txt', 'json']).withMessage('Invalid export format')
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

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true
    });

    if (!resume) {
      return res.status(404).json({
        status: 'error',
        message: 'Resume not found'
      });
    }

    const format = req.params.format;

    // For now, return JSON format (implement PDF/DOCX generation later)
    if (format === 'json') {
      await resume.incrementDownload(format);
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="resume-${resume._id}.json"`);
      
      return res.json({
        resume: resume.toObject(),
        exportedAt: new Date(),
        format
      });
    }

    // Placeholder for other formats
    res.status(501).json({
      status: 'error',
      message: `${format.toUpperCase()} export not yet implemented`,
      availableFormats: ['json']
    });

  } catch (error) {
    console.error('Resume export error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to export resume'
    });
  }
});

// @route   GET /api/resume/analytics/overview
// @desc    Get resume analytics overview
// @access  Private
router.get('/analytics/overview', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const analytics = await Resume.aggregate([
      { $match: { userId, isActive: true } },
      {
        $group: {
          _id: null,
          totalResumes: { $sum: 1 },
          totalViews: { $sum: '$analytics.views' },
          totalDownloads: { $sum: '$analytics.downloads' },
          avgAtsScore: { $avg: '$aiData.atsScore' },
          popularTemplate: { $addToSet: '$template.name' }
        }
      }
    ]);

    const result = analytics[0] || {
      totalResumes: 0,
      totalViews: 0,
      totalDownloads: 0,
      avgAtsScore: 0,
      popularTemplate: []
    };

    res.json({
      status: 'success',
      data: {
        overview: result,
        user: {
          usage: req.user.usage,
          isPremium: req.user.isPremium(),
          subscriptionDaysRemaining: req.user.subscriptionDaysRemaining
        }
      }
    });

  } catch (error) {
    console.error('Resume analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch analytics'
    });
  }
});

module.exports = router;