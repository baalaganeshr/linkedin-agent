// Networking routes for LinkedInScholar (FREE version with Groq AI)
const express = require('express');
const authMiddleware = require('../middleware/auth');
const NetworkingSuggestion = require('../models/NetworkingSuggestion');
const aiService = require('../services/aiService');
const router = express.Router();

/**
 * Get networking suggestions (FREE with Groq AI)
 * GET /api/networking/suggestions
 */
router.get('/suggestions', authMiddleware, async (req, res) => {
  try {
    const { targetRole, industry, location } = req.query;
    
    // Get user profile data
    const userProfile = {
      fullName: req.user.fullName,
      education: req.user.linkedinProfile?.education || [],
      skills: req.user.linkedinProfile?.skills || [],
      experience: req.user.linkedinProfile?.experience || [],
      location: location || 'India'
    };
    
    console.log('Generating networking suggestions for:', userProfile.fullName);
    
    // Generate networking suggestions using FREE Groq AI
    const suggestions = await aiService.generateNetworkingSuggestions(
      userProfile, 
      targetRole || 'Software Developer'
    );
    
    // Store suggestions for history
    const networkingSuggestion = new NetworkingSuggestion({
      userId: req.user._id,
      targetRole: targetRole || 'Software Developer',
      suggestions: suggestions,
      generatedAt: new Date()
    });
    
    await networkingSuggestion.save();
    
    res.json({
      success: true,
      message: 'Networking suggestions generated with FREE Groq AI!',
      suggestions,
      targetRole: targetRole || 'Software Developer',
      aiUsed: 'Groq (FREE)',
      personalizedFor: userProfile.fullName,
      tip: 'Start with alumni connections - they are most likely to respond!'
    });
    
  } catch (error) {
    console.error('Networking suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate networking suggestions',
      details: error.message,
      fallback: 'Try connecting with your college alumni and classmates first'
    });
  }
});

/**
 * Generate personalized connection message (FREE with Groq AI)
 * POST /api/networking/message
 */
router.post('/message', authMiddleware, async (req, res) => {
  try {
    const { targetName, targetRole, targetCompany, context, messageType } = req.body;
    
    if (!targetName) {
      return res.status(400).json({
        success: false,
        error: 'Target person name is required'
      });
    }
    
    // User profile for personalization
    const userProfile = {
      fullName: req.user.fullName,
      headline: req.user.linkedinProfile?.headline || 'Computer Science Student',
      education: req.user.linkedinProfile?.education || [],
      skills: req.user.linkedinProfile?.skills || []
    };
    
    // Target profile
    const targetProfile = {
      name: targetName,
      role: targetRole || 'Professional',
      company: targetCompany || 'Company'
    };
    
    console.log(`Generating connection message from ${userProfile.fullName} to ${targetName}`);
    
    // Generate personalized message using FREE Groq AI
    const connectionMessages = await aiService.generateConnectionMessage(
      targetProfile,
      userProfile,
      context || 'general networking'
    );
    
    res.json({
      success: true,
      message: 'Connection messages generated with FREE Groq AI!',
      messages: connectionMessages.messages,
      target: {
        name: targetName,
        role: targetRole,
        company: targetCompany
      },
      personalizedFor: userProfile.fullName,
      aiUsed: 'Groq (FREE)',
      tips: [
        'Choose the message that feels most authentic to you',
        'Personalize further with specific details from their profile',
        'Send connection requests during business hours for better response rates',
        'Follow up with a thank you message if they accept'
      ]
    });
    
  } catch (error) {
    console.error('Connection message generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate connection message',
      details: error.message,
      fallback: `Hi ${req.body.targetName}, I'm a student interested in learning about your work at ${req.body.targetCompany}. Would love to connect!`
    });
  }
});

/**
 * Get networking history
 * GET /api/networking/history
 */
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const history = await NetworkingSuggestion.find({ userId: req.user._id })
      .sort({ generatedAt: -1 })
      .limit(10)
      .select('-suggestions'); // Don't include full suggestions in history list
    
    res.json({
      success: true,
      history,
      total: history.length,
      aiPowered: 'Groq (FREE)',
      tip: 'Review your networking history to track your progress'
    });
    
  } catch (error) {
    console.error('Networking history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch networking history'
    });
  }
});

/**
 * Get networking action recommendations
 * POST /api/networking/actions
 */
router.post('/actions', authMiddleware, async (req, res) => {
  try {
    const { currentConnections, targetIndustry, careerLevel } = req.body;
    
    // Basic networking action recommendations
    const actions = {
      immediate: [
        {
          action: 'Connect with college alumni',
          priority: 'High',
          effort: 'Low',
          impact: 'High',
          timeline: 'This week',
          description: 'Alumni are most likely to help fellow students'
        },
        {
          action: 'Join relevant LinkedIn groups',
          priority: 'High', 
          effort: 'Low',
          impact: 'Medium',
          timeline: 'This week',
          description: 'Engage with industry professionals in group discussions'
        },
        {
          action: 'Follow target companies',
          priority: 'Medium',
          effort: 'Low',
          impact: 'Medium',
          timeline: 'This week',
          description: 'Stay updated on company news and job openings'
        }
      ],
      monthly: [
        {
          action: 'Attend virtual tech meetups',
          priority: 'High',
          effort: 'Medium',
          impact: 'High',
          timeline: 'Monthly',
          description: 'Network with professionals in your field'
        },
        {
          action: 'Share technical content',
          priority: 'Medium',
          effort: 'Medium',
          impact: 'High',
          timeline: 'Weekly',
          description: 'Showcase your knowledge and attract connections'
        },
        {
          action: 'Reach out to 5 new connections',
          priority: 'High',
          effort: 'Medium',
          impact: 'High',
          timeline: 'Monthly',
          description: 'Consistently grow your professional network'
        }
      ],
      longterm: [
        {
          action: 'Get recommendations from professors',
          priority: 'High',
          effort: 'High',
          impact: 'Very High',
          timeline: '3 months',
          description: 'Strong recommendations boost your credibility'
        },
        {
          action: 'Mentor junior students',
          priority: 'Medium',
          effort: 'High', 
          impact: 'High',
          timeline: '6 months',
          description: 'Build leadership experience and expand network'
        }
      ]
    };
    
    // Personalize based on user data
    const personalizedTips = [
      `As a ${req.user.linkedinProfile?.headline || 'student'}, focus on connecting with professionals in your target industry`,
      'Start with warm connections (friends, family, professors) who can introduce you to others',
      'Quality over quantity - 10 meaningful connections are better than 100 random ones',
      'Always personalize your connection requests with a specific reason for connecting'
    ];
    
    res.json({
      success: true,
      message: 'Networking action plan generated',
      actions,
      personalizedTips,
      nextStep: 'Start with immediate actions this week',
      trackProgress: 'Update your connection count monthly to see growth'
    });
    
  } catch (error) {
    console.error('Networking actions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate networking actions'
    });
  }
});

/**
 * Find networking events and opportunities
 * GET /api/networking/events
 */
router.get('/events', authMiddleware, async (req, res) => {
  try {
    const { location, industry } = req.query;
    
    // Sample networking events and opportunities (in real app, this could be dynamic)
    const events = {
      online: [
        {
          name: 'GDG (Google Developer Groups) India',
          type: 'Tech Meetup',
          frequency: 'Monthly',
          cost: 'FREE',
          description: 'Connect with developers and learn about latest technologies',
          link: 'https://gdg.community.dev/',
          relevantFor: ['Software Development', 'Cloud Computing', 'Mobile Development']
        },
        {
          name: 'LinkedIn Local India',
          type: 'Professional Networking',
          frequency: 'Quarterly',
          cost: 'FREE',
          description: 'In-person networking events organized by LinkedIn community',
          link: 'https://www.linkedin.com/company/linkedin-local/',
          relevantFor: ['All Industries']
        },
        {
          name: 'Meetup.com Tech Groups',
          type: 'Various Tech Meetups',
          frequency: 'Weekly',
          cost: 'FREE',
          description: 'Local tech meetups in major Indian cities',
          link: 'https://www.meetup.com/',
          relevantFor: ['Technology', 'Startups', 'Data Science']
        }
      ],
      virtual: [
        {
          name: 'GitHub Community Events',
          type: 'Open Source',
          frequency: 'Weekly',
          cost: 'FREE',
          description: 'Contribute to open source and network with developers globally',
          link: 'https://github.com/events',
          relevantFor: ['Software Development', 'Open Source']
        },
        {
          name: 'Hashnode Community',
          type: 'Developer Community',
          frequency: 'Daily',
          cost: 'FREE',
          description: 'Write tech blogs and connect with developer community',
          link: 'https://hashnode.com/',
          relevantFor: ['Software Development', 'Technical Writing']
        }
      ],
      local: [
        {
          name: 'College Alumni Networks',
          type: 'Alumni Meetups',
          frequency: 'Quarterly',
          cost: 'FREE',
          description: 'Connect with alumni working in your target companies',
          relevantFor: ['All Industries'],
          tip: 'Check your college website for alumni directory'
        },
        {
          name: 'Local Startup Events',
          type: 'Startup Networking',
          frequency: 'Monthly',
          cost: 'FREE-₹500',
          description: 'Meet startup founders and early employees in your city',
          relevantFor: ['Startups', 'Entrepreneurship']
        }
      ]
    };
    
    res.json({
      success: true,
      message: 'Networking events and opportunities found',
      events,
      tips: [
        'Start with online events to build confidence',
        'Prepare your elevator pitch before attending',
        'Follow up with new connections within 24 hours',
        'Quality networking is about giving value, not just receiving'
      ],
      personalizedFor: location || 'India',
      targetIndustry: industry || 'Technology'
    });
    
  } catch (error) {
    console.error('Networking events error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch networking events'
    });
  }
});

/**
 * Track networking progress
 * POST /api/networking/track
 */
router.post('/track', authMiddleware, async (req, res) => {
  try {
    const { action, result, notes, connectionName, companyName } = req.body;
    
    // Simple progress tracking (in a real app, you'd have a dedicated tracking model)
    if (!req.user.networkingProgress) {
      req.user.networkingProgress = {
        connectionsAttempted: 0,
        connectionsAccepted: 0,
        messagesExchanged: 0,
        meetingsScheduled: 0,
        activities: []
      };
    }
    
    // Update progress based on action
    if (action === 'connection_sent') {
      req.user.networkingProgress.connectionsAttempted += 1;
    } else if (action === 'connection_accepted') {
      req.user.networkingProgress.connectionsAccepted += 1;
    } else if (action === 'message_exchanged') {
      req.user.networkingProgress.messagesExchanged += 1;
    } else if (action === 'meeting_scheduled') {
      req.user.networkingProgress.meetingsScheduled += 1;
    }
    
    // Add activity to history
    req.user.networkingProgress.activities.unshift({
      action,
      result,
      notes,
      connectionName,
      companyName,
      date: new Date()
    });
    
    // Keep only last 50 activities
    if (req.user.networkingProgress.activities.length > 50) {
      req.user.networkingProgress.activities = req.user.networkingProgress.activities.slice(0, 50);
    }
    
    await req.user.save();
    
    // Calculate success rate
    const successRate = req.user.networkingProgress.connectionsAttempted > 0 
      ? Math.round((req.user.networkingProgress.connectionsAccepted / req.user.networkingProgress.connectionsAttempted) * 100)
      : 0;
    
    res.json({
      success: true,
      message: 'Networking progress updated successfully',
      progress: req.user.networkingProgress,
      successRate: `${successRate}%`,
      insights: {
        totalActivities: req.user.networkingProgress.activities.length,
        successRate,
        tip: successRate < 20 ? 'Try personalizing your connection messages more' : 'Great networking success rate!'
      }
    });
    
  } catch (error) {
    console.error('Networking tracking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track networking progress'
    });
  }
});

module.exports = router;