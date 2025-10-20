import * as Sentry from '@sentry/react';

// Initialize Sentry
export const initSentry = () => {
  // Only initialize in production or when SENTRY_DSN is provided
  if (import.meta.env.PROD || import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      integrations: [
        // Browser-specific integrations
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          // Only capture replays for errors in production
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      
      // Performance monitoring
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // 10% in prod, 100% in dev
      
      // Session replay - only capture on errors
      replaysSessionSampleRate: 0.0, // Don't capture all sessions
      replaysOnErrorSampleRate: 1.0, // Capture replay on error
      
      // Filter out non-error events in production
      beforeSend(event, hint) {
        // Don't send events in development unless SENTRY_DSN is explicitly set
        if (import.meta.env.DEV && !import.meta.env.VITE_SENTRY_DSN) {
          return null;
        }
        
        // Filter out known non-critical errors
        if (event.exception) {
          const error = hint.originalException;
          
          // Skip network errors that are likely user connectivity issues
          if (error && error.message && (
            error.message.includes('Network Error') ||
            error.message.includes('fetch') ||
            error.message.includes('CORS')
          )) {
            return null;
          }
        }
        
        return event;
      },
      
      // Set user context
      initialScope: {
        tags: {
          component: 'linkedin-scholar-frontend'
        }
      }
    });
    
    console.log('✅ Sentry initialized for error tracking');
  } else {
    console.log('📊 Sentry disabled in development (set VITE_SENTRY_DSN to enable)');
  }
};

// Export Sentry for use in components
export { Sentry };

// Custom error boundary component
export const SentryErrorBoundary = Sentry.ErrorBoundary;

// Helper function to capture exceptions
export const captureException = (error, context = {}) => {
  if (import.meta.env.DEV) {
    console.error('🚨 Error captured:', error, context);
  }
  
  Sentry.withScope((scope) => {
    // Add context to the error
    Object.keys(context).forEach(key => {
      scope.setTag(key, context[key]);
    });
    
    Sentry.captureException(error);
  });
};

// Helper function to capture messages
export const captureMessage = (message, level = 'info', context = {}) => {
  if (import.meta.env.DEV) {
    console.log(`📝 Message captured (${level}):`, message, context);
  }
  
  Sentry.withScope((scope) => {
    Object.keys(context).forEach(key => {
      scope.setTag(key, context[key]);
    });
    
    Sentry.captureMessage(message, level);
  });
};

// Set user context
export const setUserContext = (user) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.fullName
  });
};

// Clear user context on logout
export const clearUserContext = () => {
  Sentry.setUser(null);
};