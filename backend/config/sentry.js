const Sentry = require('@sentry/node');
const logger = require('./logger');

/**
 * Initialize Sentry for error tracking and performance monitoring
 */
const initSentry = () => {
  // Only initialize in production or when SENTRY_DSN is provided
  if (process.env.NODE_ENV === 'production' || process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      
      // Performance monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Filter out known non-critical errors
      beforeSend(event, hint) {
        // Don't send events in development unless SENTRY_DSN is explicitly set
        if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_DSN) {
          return null;
        }
        
        // Filter out database connection retry errors (handled gracefully)
        if (event.exception) {
          const error = hint.originalException;
          
          if (error && error.message && (
            error.message.includes('ECONNREFUSED') ||
            error.message.includes('MongoNetworkError') ||
            error.message.includes('connection timed out')
          )) {
            return null;
          }
        }
        
        return event;
      },
      
      // Set default tags
      initialScope: {
        tags: {
          component: 'linkedin-scholar-backend',
          version: process.env.npm_package_version || '1.0.0'
        }
      }
    });
    
    logger.info('✅ Sentry initialized for error tracking');
  } else {
    logger.info('📊 Sentry disabled in development (set SENTRY_DSN to enable)');
  }
};

/**
 * Express middleware to capture Sentry errors
 */
const sentryErrorHandler = Sentry.Handlers.errorHandler({
  shouldHandleError(error) {
    // Only capture 500+ errors
    return error.status >= 500;
  }
});

/**
 * Express middleware to add Sentry request context
 */
const sentryRequestHandler = Sentry.Handlers.requestHandler({
  user: ['id', 'email', 'fullName'],
  request: ['method', 'url', 'headers'],
  serverName: false
});

/**
 * Capture exception with context
 */
const captureException = (error, context = {}) => {
  if (process.env.NODE_ENV === 'development') {
    logger.error('🚨 Error captured:', { error: error.message, stack: error.stack, ...context });
  }
  
  Sentry.withScope((scope) => {
    // Add context to the error
    Object.keys(context).forEach(key => {
      scope.setTag(key, context[key]);
    });
    
    Sentry.captureException(error);
  });
};

/**
 * Capture message with context
 */
const captureMessage = (message, level = 'info', context = {}) => {
  if (process.env.NODE_ENV === 'development') {
    logger.info(`📝 Message captured (${level}):`, { message, ...context });
  }
  
  Sentry.withScope((scope) => {
    Object.keys(context).forEach(key => {
      scope.setTag(key, context[key]);
    });
    
    Sentry.captureMessage(message, level);
  });
};

/**
 * Set user context for current request
 */
const setUserContext = (user) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.fullName
  });
};

/**
 * Add breadcrumb for debugging
 */
const addBreadcrumb = (message, category = 'custom', level = 'info', data = {}) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data
  });
};

module.exports = {
  initSentry,
  sentryErrorHandler,
  sentryRequestHandler,
  captureException,
  captureMessage,
  setUserContext,
  addBreadcrumb,
  Sentry
};