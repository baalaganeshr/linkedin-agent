// Resume routes for LinkedInScholar (FREE version with Groq AI)
const express = require('express');
const { auth } = require('../middleware/auth');
const Resume = require('../models/Resume');
const aiService = require('../services/aiService');
const router = express.Router();

/**
 * Generate AI-powered resume (FREE with Groq API)
 * POST /api/resume/generate
 */
router.post('/generate', auth, async (req, res) => {
  try {
    // Get profile data from request body or user object
    const requestData = req.body.profileData || req.body;
    
    const profileData = {
      fullName: requestData.fullName || req.user.fullName,
      email: requestData.email || req.user.email,
      phone: requestData.phone || req.user.phone || '',
      linkedin: requestData.linkedin || req.user.linkedinProfile?.url || '',
      headline: requestData.headline || req.user.linkedinProfile?.headline || 'Professional',
      summary: requestData.summary || req.user.linkedinProfile?.summary || '',
      experience: requestData.experience || req.user.linkedinProfile?.experience || [],
      education: requestData.education || req.user.linkedinProfile?.education || [],
      skills: requestData.skills || req.user.linkedinProfile?.skills || { technical: [], soft: [] },
      projects: requestData.projects || [],
      targetRole: requestData.targetRole || req.body.targetRole || 'Software Developer'
    };
    
    console.log('Generating resume for:', profileData.fullName);
    
    // Generate resume using FREE Groq AI
    const resumeContent = await aiService.generateResume(profileData);
    
    // Create resume document
    const resume = new Resume({
      userId: req.user._id,
      title: `Resume - ${profileData.fullName} - ${new Date().toLocaleDateString()}`,
      content: resumeContent,
      aiGenerated: true
    });
    
    await resume.save();
    
    res.json({
      success: true,
      message: 'Resume generated successfully with FREE Groq AI!',
      resume: resume,
      aiUsed: 'Groq (FREE)',
      remainingRequests: '14,400 daily requests available'
    });
    
  } catch (error) {
    console.error('Resume generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate resume',
      details: error.message,
      fallback: 'Using template resume instead'
    });
  }
});

/**
 * Get user's resume list
 * GET /api/resume/list
 */
router.get('/list', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-content'); // Don't include full content in list
    
    res.json({ 
      success: true,
      resumes,
      total: resumes.length,
      aiPowered: 'Groq (FREE)'
    });
  } catch (error) {
    console.error('Resume list error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch resumes' 
    });
  }
});

/**
 * Get specific resume
 * GET /api/resume/:id
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!resume) {
      return res.status(404).json({ 
        success: false,
        error: 'Resume not found' 
      });
    }
    
    res.json({ 
      success: true,
      resume,
      aiPowered: resume.aiGenerated ? 'Groq (FREE)' : 'Manual'
    });
  } catch (error) {
    console.error('Resume fetch error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch resume' 
    });
  }
});

/**
 * Update resume
 * PUT /api/resume/:id
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!resume) {
      return res.status(404).json({ 
        success: false,
        error: 'Resume not found' 
      });
    }
    
    // Update resume content
    if (req.body.title) resume.title = req.body.title;
    if (req.body.content) resume.content = req.body.content;
    
    await resume.save();
    
    res.json({ 
      success: true,
      message: 'Resume updated successfully',
      resume 
    });
  } catch (error) {
    console.error('Resume update error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update resume' 
    });
  }
});

/**
 * Delete resume
 * DELETE /api/resume/:id
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!resume) {
      return res.status(404).json({ 
        success: false,
        error: 'Resume not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Resume deleted successfully' 
    });
  } catch (error) {
    console.error('Resume delete error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete resume' 
    });
  }
});

/**
 * Regenerate resume with new parameters
 * POST /api/resume/:id/regenerate
 */
router.post('/:id/regenerate', auth, async (req, res) => {
  try {
    const existingResume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!existingResume) {
      return res.status(404).json({ 
        success: false,
        error: 'Resume not found' 
      });
    }
    
    // Get updated profile data
    const profileData = {
      fullName: req.user.fullName,
      email: req.user.email,
      headline: req.user.linkedinProfile?.headline || 'Computer Science Student',
      summary: req.user.linkedinProfile?.summary || '',
      experience: req.user.linkedinProfile?.experience || [],
      education: req.user.linkedinProfile?.education || [],
      skills: req.user.linkedinProfile?.skills || [],
      targetRole: req.body.targetRole || 'Software Developer',
      ...req.body
    };
    
    // Regenerate using FREE Groq AI
    const newContent = await aiService.generateResume(profileData);
    
    // Update existing resume
    existingResume.content = newContent;
    existingResume.title = `${existingResume.title} (Updated)`;
    await existingResume.save();
    
    res.json({
      success: true,
      message: 'Resume regenerated successfully with FREE Groq AI!',
      resume: existingResume,
      aiUsed: 'Groq (FREE)',
      improvements: 'Updated with latest profile data'
    });
    
  } catch (error) {
    console.error('Resume regeneration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to regenerate resume',
      details: error.message
    });
  }
});

/**
 * Download resume as PDF (placeholder for future implementation)
 * GET /api/resume/:id/download
 */
router.get('/:id/download', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!resume) {
      return res.status(404).json({ 
        success: false,
        error: 'Resume not found' 
      });
    }
    
    // For now, return JSON (PDF generation can be added later with FREE tools)
    res.json({
      success: true,
      message: 'Resume data ready for download',
      resume: resume.content,
      note: 'PDF generation feature coming soon (also FREE!)',
      alternatives: [
        'Copy content to Google Docs and export as PDF',
        'Use browser print to PDF function',
        'Copy to MS Word and save as PDF'
      ]
    });
    
  } catch (error) {
    console.error('Resume download error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to prepare resume for download' 
    });
  }
});

module.exports = router;
