const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration - Allow frontend on port 3001
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'LinkedInScholar Backend is running'
  });
});

// Mock LinkedIn OAuth endpoint for testing
app.get('/api/auth/linkedin/authorize', (req, res) => {
  // For testing purposes, return a mock authUrl
  // In production, this would be the real LinkedIn OAuth URL
  const mockAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID || 'test'}&redirect_uri=${encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:5000/api/auth/linkedin/callback')}&scope=openid%20profile%20email`;
  
  res.json({ 
    authUrl: mockAuthUrl,
    message: 'This is a mock OAuth URL for testing. Configure LinkedIn OAuth to enable real authentication.'
  });
});

// Mock callback endpoint
app.get('/api/auth/linkedin/callback', (req, res) => {
  // For testing, redirect to frontend with mock success
  res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=mock_jwt_token_for_testing`);
});

// Mock user info endpoint
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No valid token provided' });
  }
  
  // For testing, return mock user data
  res.json({
    _id: 'mock_user_id',
    fullName: 'Test User',
    email: 'test@example.com',
    profilePicture: 'https://via.placeholder.com/40',
    subscriptionStatus: 'free'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'LinkedInScholar API - Fixed Version',
    status: 'Backend is working properly',
    endpoints: {
      health: 'GET /health',
      auth: 'GET /api/auth/linkedin/authorize',
      me: 'GET /api/auth/me'
    },
    frontend: process.env.FRONTEND_URL || 'http://localhost:3001'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 LinkedInScholar Backend (Fixed) running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3001'}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth/linkedin/authorize`);
});

module.exports = app;