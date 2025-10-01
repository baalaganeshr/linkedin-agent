// Simple test server without MongoDB dependency
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// CORS configuration for development
app.use(cors({
  origin: ['http://localhost:3002', 'http://localhost:3001', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    server: 'LinkedInScholar Backend'
  });
});

// Mock LinkedIn auth endpoint
app.get('/api/auth/linkedin/authorize', (req, res) => {
  res.status(200).json({
    message: 'LinkedIn OAuth endpoint working (mock)',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=placeholder&redirect_uri=http://localhost:5000/api/auth/linkedin/callback&scope=r_liteprofile%20r_emailaddress',
    status: 'ready_for_real_credentials'
  });
});

// Catch all other routes
app.get('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    available_endpoints: [
      'GET /health',
      'GET /api/health',
      'GET /api/auth/linkedin/authorize'
    ]
  });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log('🚀 Test Backend Server Running!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔧 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🔗 LinkedIn Auth: http://localhost:${PORT}/api/auth/linkedin/authorize`);
  console.log('✅ CORS enabled for frontend on ports 3000, 3001, 3002');
  
  // Test the server is actually working
  setTimeout(() => {
    const http = require('http');
    http.get(`http://localhost:${PORT}/health`, (res) => {
      console.log('✅ Self-test successful - server is responding');
    }).on('error', (err) => {
      console.log('❌ Self-test failed:', err.message);
    });
  }, 1000);
});