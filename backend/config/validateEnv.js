const Joi = require('joi');
const logger = require('./logger');

/**
 * Environment variables validation schema
 * Ensures all required configuration is present and valid on server startup
 */
const envSchema = Joi.object({
  // Server Configuration
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  
  PORT: Joi.number()
    .port()
    .default(5000),
  
  // Database Configuration
  MONGODB_URI: Joi.string()
    .uri()
    .required()
    .messages({
      'any.required': 'MONGODB_URI is required. Get free MongoDB Atlas at https://cloud.mongodb.com'
    }),
  
  // JWT Security
  JWT_SECRET: Joi.string()
    .min(32)
    .required()
    .messages({
      'string.min': 'JWT_SECRET must be at least 32 characters long',
      'any.required': 'JWT_SECRET is required for authentication'
    }),
  
  JWT_EXPIRE: Joi.string()
    .default('7d'),
  
  // Frontend URL for CORS
  FRONTEND_URL: Joi.string()
    .uri()
    .default('http://localhost:5173'),
  
  // AI Provider Configuration (at least one required)
  GROQ_API_KEY: Joi.string()
    .optional(),
  
  OLLAMA_HOST: Joi.string()
    .uri()
    .optional(),
  
  OLLAMA_MODEL: Joi.string()
    .optional(),
  
  OPENAI_API_KEY: Joi.string()
    .optional(),
  
  GEMINI_API_KEY: Joi.string()
    .optional(),
  
  // Rate Limiting Configuration
  RATE_LIMIT_GENERAL: Joi.number()
    .integer()
    .min(1)
    .default(100),
  
  RATE_LIMIT_AI: Joi.number()
    .integer()
    .min(1)
    .default(50),
  
  RATE_LIMIT_TEST: Joi.number()
    .integer()
    .min(1)
    .default(20),
  
  // AI Configuration
  AI_MAX_TOKENS: Joi.number()
    .integer()
    .min(100)
    .max(10000)
    .default(3000),
  
  AI_TEMPERATURE: Joi.number()
    .min(0)
    .max(2)
    .default(0.7),
  
  AI_TOP_P: Joi.number()
    .min(0)
    .max(1)
    .default(0.8),
  
  // Optional Configuration
  SENTRY_DSN: Joi.string()
    .uri()
    .optional(),
  
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info')
    
}).unknown(true); // Allow other environment variables

/**
 * Validates environment variables and returns sanitized config
 * @returns {Object} Validated environment configuration
 * @throws {Error} If validation fails
 */
function validateEnvironment() {
  const { error, value } = envSchema.validate(process.env);
  
  if (error) {
    logger.error('❌ Environment validation failed:', error.details[0].message);
    console.error('\n🔧 Environment Setup Required:');
    console.error('1. Copy .env.example to .env');
    console.error('2. Add your MongoDB URI (free at https://cloud.mongodb.com)');
    console.error('3. Add your JWT_SECRET (32+ characters)');
    console.error('4. Add at least one AI provider key (Groq recommended - free 14,400/day)');
    console.error('\nError Details:', error.details[0].message);
    process.exit(1);
  }
  
  // Validate AI provider availability
  const hasAIProvider = value.GROQ_API_KEY || 
                       value.OLLAMA_HOST || 
                       value.OPENAI_API_KEY || 
                       value.GEMINI_API_KEY;
  
  if (!hasAIProvider) {
    logger.error('❌ No AI provider configured');
    console.error('\n🤖 AI Provider Required:');
    console.error('Choose one of:');
    console.error('• GROQ_API_KEY (recommended - free 14,400 requests/day)');
    console.error('• OLLAMA_HOST=http://localhost:11434 (local, unlimited)');
    console.error('• OPENAI_API_KEY (paid)');
    console.error('• GEMINI_API_KEY (paid)');
    process.exit(1);
  }
  
  logger.info('✅ Environment validation passed');
  logger.info(`🚀 Server starting in ${value.NODE_ENV} mode`);
  logger.info(`📡 AI Providers: ${getAIProviders(value).join(', ')}`);
  
  return value;
}

/**
 * Gets list of configured AI providers
 * @param {Object} config Validated environment config
 * @returns {Array} List of available AI providers
 */
function getAIProviders(config) {
  const providers = [];
  if (config.GROQ_API_KEY) providers.push('Groq');
  if (config.OLLAMA_HOST) providers.push('Ollama');
  if (config.OPENAI_API_KEY) providers.push('OpenAI');
  if (config.GEMINI_API_KEY) providers.push('Gemini');
  return providers;
}

module.exports = validateEnvironment;