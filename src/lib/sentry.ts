import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

/**
 * Initialize Sentry SDK for error tracking and performance monitoring
 */
export const initSentry = (): void => {
  const dsn = Constants.expoConfig?.extra?.sentryDsn;

  // Skip initialization in development if DSN is not provided
  if (__DEV__ && !dsn) {
    console.log('Sentry: Skipping initialization in development (no DSN provided)');
    return;
  }

  if (!dsn) {
    console.warn('Sentry: DSN not configured. Error tracking will be disabled.');
    return;
  }

  Sentry.init({
    dsn,
    
    // Enable automatic session tracking
    enableAutoSessionTracking: true,
    
    // Session timeout (30 minutes)
    sessionTrackingIntervalMillis: 30000,
    
    // Performance monitoring - sample rate for production
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    
    // Environment detection
    environment: __DEV__ ? 'development' : 'production',
    
    // Release tracking
    release: Constants.expoConfig?.version,
    
    // Dist (build number)
    dist: Constants.expoConfig?.version,
    
    // Enable native crashes tracking
    enableNative: true,
    
    // Attach stack traces to all messages
    attachStacktrace: true,
    
    // Maximum breadcrumbs to keep
    maxBreadcrumbs: 50,
    
    // Debug mode (verbose logging in development)
    debug: __DEV__,
    
    // Hook to modify or drop events before sending
    beforeSend(event, hint) {
      // Don't send errors in development to keep Sentry dashboard clean
      if (__DEV__) {
        console.log('Sentry Event (dev only - not sent):', event);
        return null; // Don't send to Sentry in dev
      }
      
      return event; // Send to Sentry in production
    },
    
    // Hook to modify breadcrumbs before adding them
    beforeBreadcrumb(breadcrumb, hint) {
      // Filter out sensitive data from breadcrumbs if needed
      if (breadcrumb.category === 'console') {
        return null; // Don't track console logs as breadcrumbs
      }
      return breadcrumb;
    },
  });

  console.log('Sentry initialized successfully');
};

/**
 * Manually capture an exception
 */
export const captureException = (error: Error, context?: Record<string, any>): void => {
  if (context) {
    Sentry.setContext('additional_context', context);
  }
  Sentry.captureException(error);
};

/**
 * Manually capture a message
 */
export const captureMessage = (
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>
): void => {
  if (context) {
    Sentry.setContext('additional_context', context);
  }
  Sentry.captureMessage(message, level);
};

/**
 * Set user context for error tracking
 */
export const setUser = (user: {
  id?: string;
  email?: string;
  username?: string;
  [key: string]: any;
} | null): void => {
  Sentry.setUser(user);
};

/**
 * Add breadcrumb for debugging
 */
export const addBreadcrumb = (breadcrumb: {
  message: string;
  category?: string;
  level?: Sentry.SeverityLevel;
  data?: Record<string, any>;
}): void => {
  Sentry.addBreadcrumb(breadcrumb);
};

/**
 * Set custom tag
 */
export const setTag = (key: string, value: string): void => {
  Sentry.setTag(key, value);
};

/**
 * Set custom context
 */
export const setContext = (key: string, context: Record<string, any> | null): void => {
  Sentry.setContext(key, context);
};

export default Sentry;
