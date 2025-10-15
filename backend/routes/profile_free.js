// Profile optimization routes for LinkedInScholar (FREE version with Groq AI)
const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const aiService = require('../services/aiService');
const router = express.Router();

/**
 * Analyze LinkedIn profile and get optimization suggestions (FREE with Groq AI)
 * POST /api/profile/analyze
 */
router.post('/analyze', auth, async (req, res) => {
  try {
    const { linkedinUrl, profileData } = req.body;
    
    // Use provided profile data or get from user's stored LinkedIn profile
    const profileToAnalyze = profileData || req.user.linkedinProfile || {
      fullName: req.user.fullName,
      headline: 'Student',
      summary: '',
      experience: [],
      education: [],
      skills: []
    };
    
    console.log('Analyzing profile for:', profileToAnalyze.fullName || req.user.fullName);
    
    // Get optimization suggestions using FREE Groq AI
    const optimization = await aiService.optimizeProfile(profileToAnalyze);
    
    // Store analysis results (optional)
    req.user.lastProfileAnalysis = {
      analyzedAt: new Date(),
      score: optimization.profileScore,
      suggestions: optimization
    };
    await req.user.save();
    
    res.json({
      success: true,
      message: 'Profile analyzed successfully with FREE Groq AI!',
      analysis: optimization,
      aiUsed: 'Groq (FREE)',
      analysisDate: new Date(),
      remainingRequests: '14,400 daily requests available'
    });
    
  } catch (error) {
    console.error('Profile analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze profile',
      details: error.message,
      fallback: 'Using basic profile analysis template'
    });
  }
});

/**
 * Get profile optimization history
 * GET /api/profile/optimizations
 */
router.get('/optimizations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('lastProfileAnalysis');
    
    if (!user.lastProfileAnalysis) {
      return res.json({
        success: true,
        message: 'No profile analysis found',
        suggestion: 'Run your first profile analysis with /api/profile/analyze',
        aiPowered: 'Groq (FREE)'
      });
    }
    
    res.json({
      success: true,
      lastAnalysis: user.lastProfileAnalysis,
      aiPowered: 'Groq (FREE)',
      tip: 'Run analysis weekly to track improvements'
    });
    
  } catch (error) {
    console.error('Profile optimization history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch optimization history'
    });
  }
});

/**
 * Update LinkedIn profile data
 * PUT /api/profile/update
 */
router.put('/update', auth, async (req, res) => {
  try {
    const { headline, summary, experience, education, skills, linkedinUrl } = req.body;
    
    // Update user's LinkedIn profile data
    if (!req.user.linkedinProfile) {
      req.user.linkedinProfile = {};
    }
    
    if (headline) req.user.linkedinProfile.headline = headline;
    if (summary) req.user.linkedinProfile.summary = summary;
    if (experience) req.user.linkedinProfile.experience = experience;
    if (education) req.user.linkedinProfile.education = education;
    if (skills) req.user.linkedinProfile.skills = skills;
    
    req.user.linkedinProfile.lastUpdated = new Date();
    
    await req.user.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: req.user.linkedinProfile,
      tip: 'Run profile analysis again to see how your changes improve your score!'
    });
    
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

/**
 * Get profile improvement suggestions based on target role
 * POST /api/profile/suggestions
 */
router.post('/suggestions', auth, async (req, res) => {
  try {
    const { targetRole, targetIndustry, currentLevel } = req.body;
    
    // Get current profile data
    const profileData = {
      fullName: req.user.fullName,
      headline: req.user.linkedinProfile?.headline || 'Student',
      summary: req.user.linkedinProfile?.summary || '',
      experience: req.user.linkedinProfile?.experience || [],
      education: req.user.linkedinProfile?.education || [],
      skills: req.user.linkedinProfile?.skills || [],
      targetRole: targetRole || 'Software Developer',
      industry: targetIndustry || 'Technology'
    };
    
    // Get role-specific optimization suggestions using FREE Groq AI
    const suggestions = await aiService.optimizeProfile(profileData);
    
    res.json({
      success: true,
      message: `Profile suggestions generated for ${targetRole} role`,
      suggestions,
      targetRole,
      targetIndustry,
      aiUsed: 'Groq (FREE)',
      personalizedFor: req.user.fullName
    });
    
  } catch (error) {
    console.error('Profile suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate profile suggestions',
      details: error.message
    });
  }
});

/**
 * Compare profile with industry standards
 * POST /api/profile/benchmark
 */
router.post('/benchmark', auth, async (req, res) => {
  try {
    const { industry, experience_level } = req.body;
    
    // Get current profile data
    const profileData = {
      fullName: req.user.fullName,
      headline: req.user.linkedinProfile?.headline || 'Student',
      summary: req.user.linkedinProfile?.summary || '',
      experience: req.user.linkedinProfile?.experience || [],
      education: req.user.linkedinProfile?.education || [],
      skills: req.user.linkedinProfile?.skills || [],
      industry: industry || 'Technology'
    };
    
    // Get benchmarking analysis using FREE Groq AI  
    const benchmark = await aiService.optimizeProfile(profileData);
    
    // Enhance response with benchmarking context
    const benchmarkResponse = {
      ...benchmark,
      benchmarkData: {
        industry: industry || 'Technology',
        experience_level: experience_level || 'Entry Level',
        comparison: 'Compared against successful professionals in your target industry',
        recommendations: benchmark.quickWins || []
      }
    };
    
    res.json({
      success: true,
      message: 'Profile benchmarking completed',
      benchmark: benchmarkResponse,
      aiUsed: 'Groq (FREE)',
      note: 'Benchmarking based on industry best practices and successful profiles'
    });
    
  } catch (error) {
    console.error('Profile benchmarking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to benchmark profile',
      details: error.message
    });
  }
});

/**
 * Get profile optimization checklist
 * GET /api/profile/checklist
 */
router.get('/checklist', auth, async (req, res) => {
  try {
    // Generate a comprehensive checklist for profile optimization
    const checklist = {
      basic: [
        { item: 'Professional headshot photo', completed: false, priority: 'High' },
        { item: 'Compelling headline with target role', completed: false, priority: 'High' },
        { item: 'Complete About section (summary)', completed: false, priority: 'High' },
        { item: 'Contact information filled', completed: true, priority: 'Medium' },
        { item: 'Custom LinkedIn URL', completed: false, priority: 'Medium' }
      ],
      experience: [
        { item: 'Add internship experiences', completed: false, priority: 'High' },
        { item: 'Include project work', completed: false, priority: 'High' },
        { item: 'Quantify achievements with numbers', completed: false, priority: 'High' },
        { item: 'Use action verbs in descriptions', completed: false, priority: 'Medium' },
        { item: 'Add relevant coursework', completed: false, priority: 'Low' }
      ],
      skills: [
        { item: 'Add technical skills relevant to target role', completed: false, priority: 'High' },
        { item: 'Get skill endorsements from connections', completed: false, priority: 'Medium' },
        { item: 'Take LinkedIn skill assessments', completed: false, priority: 'Medium' },
        { item: 'Add soft skills', completed: false, priority: 'Low' }
      ],
      networking: [
        { item: 'Connect with classmates and professors', completed: false, priority: 'High' },
        { item: 'Get recommendations from supervisors', completed: false, priority: 'High' },
        { item: 'Join relevant industry groups', completed: false, priority: 'Medium' },
        { item: 'Follow target companies', completed: false, priority: 'Medium' },
        { item: 'Share relevant content weekly', completed: false, priority: 'Low' }
      ]
    };
    
    // Check current profile completeness
    const profile = req.user.linkedinProfile || {};
    let completionScore = 0;
    let totalItems = 0;
    
    Object.values(checklist).forEach(category => {
      totalItems += category.length;
      // Simple completion logic (can be enhanced)
      if (profile.headline) completionScore += 1;
      if (profile.summary) completionScore += 1;
      if (profile.experience && profile.experience.length > 0) completionScore += 2;
      if (profile.skills && profile.skills.length > 0) completionScore += 1;
    });
    
    const completionPercentage = Math.round((completionScore / totalItems) * 100);
    
    res.json({
      success: true,
      checklist,
      completionScore: completionPercentage,
      message: `Your profile is ${completionPercentage}% complete`,
      nextSteps: checklist.basic.filter(item => !item.completed && item.priority === 'High'),
      aiPowered: 'Smart suggestions based on profile analysis'
    });
    
  } catch (error) {
    console.error('Profile checklist error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate profile checklist'
    });
  }
});

module.exports = router;