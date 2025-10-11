const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User_phase2');
const router = express.Router();

router.get('/linkedin/authorize', (req, res) => {
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI)}&scope=openid%20profile%20email`;
  res.json({ authUrl });
});

router.get('/linkedin/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  
  try {
    const tokenResponse = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    
    const { access_token } = tokenResponse.data;
    const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    
    const profileData = profileResponse.data;
    let user = await User.findOne({ linkedinId: profileData.sub });
    
    if (!user) {
      user = new User({
        email: profileData.email,
        linkedinId: profileData.sub,
        accessToken: access_token,
        fullName: profileData.name,
        profilePicture: profileData.picture
      });
      await user.save();
    } else {
      user.accessToken = access_token;
      await user.save();
    }
    
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${jwtToken}`);
  } catch (error) {
    console.error('Auth error:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-accessToken');
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;