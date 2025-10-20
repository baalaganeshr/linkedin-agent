// LinkedIn profile optimization routes
const express = require('express');
const { body, validationResult } = require('express-validator');
const aiService = require('../services/aiService');
const User = require('../models/User');
const { auth, checkUsageLimit } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

// @route   POST /api/profile/optimize
// @desc    Get AI-powered LinkedIn profile optimization suggestions
// @access  Private (with usage limits for free users)
router.post('/optimize', [
  auth,
  checkUsageLimit('profileOptimizations'),
  body('currentProfile').isObject().withMessage('Current profile data is required'),
  body('currentProfile.headline').optional().trim().isLength({ max: 220 }),
  body('currentProfile.summary').optional().trim().isLength({ max: 2000 }),
  body('targetRole').optional().trim().isLength({ min: 2, max: 100 }),
  body('targetIndustry').optional().trim().isLength({ min: 2, max: 100 })
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

    const { currentProfile, targetRole, targetIndustry } = req.body;
    const user = req.user;

    // Merge current profile with LinkedIn data
    const profileData = {
      ...user.linkedinProfile,
      ...currentProfile
    };

    // Generate optimization suggestions using AI
    const aiResult = await aiService.optimizeProfile(user, profileData);

    if (!aiResult.success) {
      return res.status(500).json({
        status: 'error',
        message: 'AI profile optimization failed'
      });
    }

    // Update user's LinkedIn profile data if provided
    if (currentProfile) {
      await User.findByIdAndUpdate(user._id, {
        $set: {
          'linkedinProfile.headline': currentProfile.headline || user.linkedinProfile?.headline,
          'linkedinProfile.summary': currentProfile.summary || user.linkedinProfile?.summary,
          'linkedinProfile.industry': currentProfile.industry || user.linkedinProfile?.industry,
          'linkedinProfile.location': currentProfile.location || user.linkedinProfile?.location
        }
      });
    }

    // Increment user usage
    await user.incrementUsage('profileOptimizations');

    res.json({
      status: 'success',
      message: 'Profile optimization completed',
      data: {
        optimizations: aiResult.data,
        metadata: aiResult.metadata,
        usage: {
          current: user.usage.profileOptimizations + 1,
          limit: user.isPremium() ? 'unlimited' : 5
        }
      }
    });

  } catch (error) {
    logger.error('Profile optimization error', { error: error.message, userId: req.user?.id });
    res.status(500).json({
      status: 'error',
      message: 'Failed to optimize profile',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/profile/analysis
// @desc    Get current profile analysis
// @access  Private
router.get('/analysis', auth, async (req, res) => {
  try {
    const user = req.user;
    const profile = user.linkedinProfile || {};

    // Calculate profile completeness score
    const completenessFactors = {
      headline: profile.headline ? 15 : 0,
      summary: profile.summary ? 20 : 0,
      industry: profile.industry ? 10 : 0,
      location: profile.location ? 10 : 0,
      profilePicture: user.profilePicture ? 10 : 0,
      connections: profile.connections > 0 ? 10 : 0,
      education: user.studentInfo?.college ? 15 : 0,
      fieldOfStudy: user.studentInfo?.fieldOfStudy ? 10 : 0
    };

    const completenessScore = Object.values(completenessFactors).reduce((sum, score) => sum + score, 0);

    // Identify missing elements
    const missingElements = [];
    if (!profile.headline) missingElements.push('Professional headline');
    if (!profile.summary) missingElements.push('About section');
    if (!profile.industry) missingElements.push('Industry information');
    if (!profile.location) missingElements.push('Location');
    if (!user.profilePicture) missingElements.push('Profile picture');
    if (!user.studentInfo?.college) missingElements.push('Education details');

    // Generate improvement priorities
    const improvements = [];
    if (!profile.summary) {
      improvements.push({
        priority: 'high',
        section: 'About Section',
        issue: 'Missing professional summary',
        suggestion: 'Add a compelling summary highlighting your skills, aspirations, and unique value proposition',
        impact: 'Increases profile views by 40%'
      });
    }

    if (!profile.headline || profile.headline.includes('Student')) {
      improvements.push({
        priority: 'high',
        section: 'Headline',
        issue: 'Generic or missing headline',
        suggestion: 'Create a specific headline mentioning your field, skills, and career goals',
        impact: 'Improves search visibility and first impression'
      });
    }

    if (profile.connections < 50) {
      improvements.push({
        priority: 'medium',
        section: 'Network',
        issue: 'Limited connections',
        suggestion: 'Connect with classmates, professors, and industry professionals',
        impact: 'Expands visibility and opportunities'
      });
    }

    res.json({
      status: 'success',
      data: {
        currentProfile: {
          headline: profile.headline || null,
          summary: profile.summary || null,
          industry: profile.industry || null,
          location: profile.location || null,
          connections: profile.connections || 0,
          publicProfileUrl: profile.publicProfileUrl || null
        },
        analysis: {
          completenessScore,
          completenessFactors,
          missingElements,
          improvements,
          recommendations: [
            'Add relevant skills to increase discoverability',
            'Request recommendations from professors or supervisors',
            'Share content regularly to show engagement',
            'Join industry-specific groups and participate in discussions',
            'Update your status with career updates and achievements'
          ]
        },
        usage: {
          profileOptimizations: {
            current: user.usage.profileOptimizations,
            limit: user.isPremium() ? 'unlimited' : 5,
            canUse: user.canUseFeature('profileOptimizations')
          }
        }
      }
    });

  } catch (error) {
    logger.error('Profile analysis error', { error: error.message, userId: req.user?.id });
    res.status(500).json({
      status: 'error',
      message: 'Failed to analyze profile'
    });
  }
});

// @route   POST /api/profile/headline-suggestions
// @desc    Get AI-generated headline suggestions
// @access  Private
router.post('/headline-suggestions', [
  auth,
  body('targetRole').optional().trim().isLength({ min: 2, max: 100 }),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('interests').optional().isArray().withMessage('Interests must be an array')
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

    const { targetRole, skills = [], interests = [] } = req.body;
    const user = req.user;

    // Generate headline suggestions based on user data
    const suggestions = [];
    const fieldOfStudy = user.studentInfo?.fieldOfStudy || 'Computer Science';
    const currentYear = user.studentInfo?.currentYear || 'Final Year';
    const college = user.studentInfo?.college || 'Engineering Student';

    // Template-based suggestions
    if (targetRole) {
      suggestions.push(`Aspiring ${targetRole} | ${fieldOfStudy} ${currentYear} | ${skills.slice(0, 2).join(' & ')} Enthusiast`);
      suggestions.push(`${currentYear} ${fieldOfStudy} Student | Future ${targetRole} | Passionate about ${interests.slice(0, 2).join(' & ')}`);
    }

    suggestions.push(`${fieldOfStudy} ${currentYear} at ${college} | ${skills.slice(0, 3).join(', ')} | Open for Opportunities`);
    suggestions.push(`${currentYear} Engineering Student | ${skills.slice(0, 2).join(' & ')} | Seeking ${targetRole || 'Internships'}`);
    suggestions.push(`Passionate ${fieldOfStudy} Student | ${interests.slice(0, 2).join(' & ')} | Building Tomorrow's Solutions`);

    // Industry-specific suggestions
    if (targetRole?.toLowerCase().includes('software') || targetRole?.toLowerCase().includes('developer')) {
      suggestions.push(`Full Stack Developer in Making | ${fieldOfStudy} Student | MERN Stack & Problem Solver`);
      suggestions.push(`Code, Create, Innovate | ${currentYear} ${fieldOfStudy} | Open Source Contributor`);
    }

    if (targetRole?.toLowerCase().includes('data') || targetRole?.toLowerCase().includes('analyst')) {
      suggestions.push(`Data Science Enthusiast | ${fieldOfStudy} ${currentYear} | Python, ML & Analytics`);
      suggestions.push(`Turning Data into Insights | ${fieldOfStudy} Student | ML & AI Explorer`);
    }

    // Remove duplicates and limit to 8 suggestions
    const uniqueSuggestions = [...new Set(suggestions)].slice(0, 8);

    res.json({
      status: 'success',
      data: {
        suggestions: uniqueSuggestions.map((headline, index) => ({
          id: index + 1,
          headline,
          length: headline.length,
          keywords: extractKeywords(headline),
          tone: classifyTone(headline)
        })),
        tips: [
          'Keep it under 220 characters',
          'Include your field of study and year',
          'Mention 2-3 key skills or interests',
          'Use action words like "Building", "Creating", "Aspiring"',
          'Make it specific to your career goals',
          'Update it regularly as you gain new skills'
        ]
      }
    });

  } catch (error) {
    logger.error('Headline suggestions error', { error: error.message, userId: req.user?.id });
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate headline suggestions'
    });
  }
});

// @route   POST /api/profile/summary-template
// @desc    Get AI-generated summary template
// @access  Private
router.post('/summary-template', [
  auth,
  body('tone').optional().isIn(['professional', 'friendly', 'creative', 'academic']).withMessage('Invalid tone'),
  body('highlights').optional().isArray().withMessage('Highlights must be an array'),
  body('careerGoals').optional().trim().isLength({ max: 200 })
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

    const { tone = 'professional', highlights = [], careerGoals } = req.body;
    const user = req.user;

    const fieldOfStudy = user.studentInfo?.fieldOfStudy || 'Computer Science';
    const currentYear = user.studentInfo?.currentYear || 'Final Year';
    const college = user.studentInfo?.college || 'a premier engineering college';

    // Generate summary template
    let template = '';

    if (tone === 'professional') {
      template = `I am a dedicated ${currentYear} ${fieldOfStudy} student at ${college}, passionate about leveraging technology to solve real-world problems. `;
      
      if (highlights.length > 0) {
        template += `My experience includes ${highlights.slice(0, 3).join(', ')}, which has strengthened my technical foundation and problem-solving abilities. `;
      }
      
      template += `I am actively seeking opportunities to apply my knowledge and contribute to innovative projects. `;
      
      if (careerGoals) {
        template += `My goal is to ${careerGoals.toLowerCase()} and make a meaningful impact in the technology industry.`;
      } else {
        template += `I am eager to grow as a professional and contribute to meaningful technological advancement.`;
      }
    }

    // Generate multiple template variations
    const templates = [
      {
        id: 1,
        tone: 'professional',
        template: template,
        length: template.length,
        structure: ['Introduction', 'Experience/Skills', 'Goals', 'Call to Action']
      },
      {
        id: 2,
        tone: 'friendly',
        template: `Hi there! I'm a ${currentYear} ${fieldOfStudy} student who loves building things with code. ${highlights.length > 0 ? `I've worked on ${highlights.slice(0, 2).join(' and ')}, ` : ''}and I'm always excited to learn new technologies and connect with fellow tech enthusiasts. Looking forward to opportunities where I can contribute and grow!`,
        length: 0,
        structure: ['Greeting', 'Background', 'Interests', 'Connection']
      },
      {
        id: 3,
        tone: 'creative',
        template: `🚀 ${fieldOfStudy} student by day, code enthusiast by night! Currently in my ${currentYear} at ${college}, I believe in the power of technology to transform ideas into reality. ${highlights.length > 0 ? `From ${highlights[0]} to exploring new frameworks, ` : ''}I'm on a mission to create solutions that matter. Let's connect and build something amazing together!`,
        length: 0,
        structure: ['Hook', 'Identity', 'Mission', 'Invitation']
      }
    ];

    // Calculate lengths
    templates.forEach(t => {
      t.length = t.template.length;
    });

    res.json({
      status: 'success',
      data: {
        templates,
        tips: [
          'Start with your current status (student, year, field)',
          'Mention key skills or projects briefly',
          'Include your career aspirations',
          'End with a call to action (connect, collaborate)',
          'Keep it between 150-300 words',
          'Use keywords relevant to your target industry',
          'Make it personal but professional',
          'Update it regularly with new achievements'
        ],
        structure: {
          paragraph1: 'Who you are and what you study',
          paragraph2: 'Your skills, projects, or experience',
          paragraph3: 'Your goals and what you\'re looking for',
          paragraph4: 'Call to action (optional)'
        }
      }
    });

  } catch (error) {
    logger.error('Summary template error', { error: error.message, userId: req.user?.id });
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate summary template'
    });
  }
});

// Helper function to extract keywords from headline
function extractKeywords(headline) {
  const commonWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', '|', '&'];
  return headline
    .toLowerCase()
    .split(/[\s|&,]+/)
    .filter(word => word.length > 2 && !commonWords.includes(word))
    .slice(0, 5);
}

// Helper function to classify tone
function classifyTone(headline) {
  const creativePhrases = ['building', 'creating', 'innovate', 'passionate', 'enthusiast'];
  const professionalPhrases = ['aspiring', 'seeking', 'student', 'engineering'];
  
  const text = headline.toLowerCase();
  
  if (creativePhrases.some(phrase => text.includes(phrase))) {
    return 'creative';
  } else if (professionalPhrases.some(phrase => text.includes(phrase))) {
    return 'professional';
  } else {
    return 'balanced';
  }
}

module.exports = router;
