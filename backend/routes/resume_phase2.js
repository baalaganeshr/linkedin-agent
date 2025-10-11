const express = require('express');
const authMiddleware = require('../middleware/auth_phase2');
const Resume = require('../models/Resume_phase2');
const aiService = require('../services/aiService_phase2');
const router = express.Router();

router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const profileData = {
      fullName: req.user.fullName,
      email: req.user.email,
      headline: req.user.linkedinProfile?.headline,
      experience: req.user.linkedinProfile?.experience || [],
      education: req.user.linkedinProfile?.education || [],
      skills: req.user.linkedinProfile?.skills || []
    };
    
    const resumeContent = await aiService.generateResume(profileData);
    
    const resume = new Resume({
      userId: req.user._id,
      title: `Resume - ${profileData.fullName} - ${new Date().toLocaleDateString()}`,
      content: resumeContent,
      aiGenerated: true
    });
    
    await resume.save();
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate resume' });
  }
});

router.get('/list', authMiddleware, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ resumes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json({ resume });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json({ message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

module.exports = router;