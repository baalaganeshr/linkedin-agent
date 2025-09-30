// LinkedInScholar Backend Server
// Dark theme AI-powered LinkedIn guidance platform
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    }
  }
}));

// Rate limiting - 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: 'Too many requests, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'LinkedInScholar API - 100% FREE VERSION ⚡',
    version: '2.0-FREE',
    ai: 'Groq (FREE - 14,400 requests/day)',
    database: 'MongoDB Atlas (FREE - 512MB)',
    hosting: 'Render (FREE)',
    cost: '₹0 per month',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    features: [
      'Unlimited Resume Generation',
      'Unlimited Profile Optimization', 
      'Unlimited Networking Suggestions',
      'LinkedIn OAuth Integration',
      'No Premium Plans - Everything FREE!'
    ]
  });
});

// API Routes - 100% FREE VERSION using Groq AI
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resume', require('./routes/resume_free'));
app.use('/api/profile', require('./routes/profile_free'));
app.use('/api/networking', require('./routes/networking_free'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  // Default error response
  let error = {
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.message = 'Validation failed';
    error.details = Object.values(err.errors).map(e => e.message);
    return res.status(400).json(error);
  }

  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    return res.status(401).json(error);
  }

  if (err.code === 11000) {
    error.message = 'Duplicate field value';
    return res.status(400).json(error);
  }

  res.status(err.statusCode || 500).json(error);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 LinkedInScholar Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;