// LinkedInScholar Backend Server - Production Ready
// Dark theme AI-powered LinkedIn guidance platform
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const logger = require('./config/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { sanitizeInput } = require('./middleware/validation');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// Security middleware - Helmet with enhanced CSP
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

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['skills', 'experience', 'education', 'projects'] // Allow arrays for these fields
}));

// Compression middleware
app.use(compression());

// Rate limiting - Enhanced with multiple windows
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

// Strict rate limiting for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 requests per hour for AI endpoints
  message: {
    error: 'Too many AI requests. Please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development', // Skip in development
});

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

// Input sanitization middleware
app.use(sanitizeInput);

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

// API Routes - 100% FREE VERSION using Ollama AI
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resume', aiLimiter, require('./routes/resume_free'));
app.use('/api/profile', aiLimiter, require('./routes/profile_free'));
app.use('/api/networking', aiLimiter, require('./routes/networking_free'));

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, shutting down gracefully`);
  console.log(`🛑 ${signal} received, shutting down gracefully`);
  
  // Close server
  server.close(async () => {
    logger.info('HTTP server closed');
    
    // Close database connection
    try {
      await require('mongoose').connection.close();
      logger.info('Database connection closed');
      console.log('🛑 Database connection closed');
      process.exit(0);
    } catch (err) {
      logger.error('Error closing database:', err);
      process.exit(1);
    }
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`LinkedInScholar Server started on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 LinkedInScholar Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔒 Security: Enhanced with Helmet, Rate Limiting, Sanitization`);
  console.log(`📊 Logging: Winston + Morgan`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', err);
  console.error('❌ UNHANDLED REJECTION:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  console.error('❌ UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

module.exports = app;