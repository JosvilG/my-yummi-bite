/**
 * Feature Flags Configuration
 *
 * Centralized configuration for feature flags across the application.
 * Use __DEV__ to automatically toggle features between development and production.
 */

export const FeatureFlags = {
  /**
   * Use mock data instead of real API calls for Spoonacular.
   * Enabled by default in development to save API tokens.
   */
  USE_MOCK_RECIPES: __DEV__,

  /**
   * Enable debug logging throughout the app.
   */
  ENABLE_DEBUG_LOGS: __DEV__,

  /**
   * Show developer tools and debug UI elements.
   */
  SHOW_DEV_TOOLS: __DEV__,

  /**
   * Skip authentication for faster development iteration.
   * WARNING: Should always be false in production.
   */
  SKIP_AUTH: false,

  /**
   * Enable experimental swipe animations.
   */
  ENABLE_SWIPE_ANIMATIONS: true,

  /**
   * Enable offline mode with cached data.
   */
  ENABLE_OFFLINE_MODE: false,

  /**
   * Show recipe nutrition information.
   */
  SHOW_NUTRITION_INFO: true,

  /**
   * Enable camera feature for recipe scanning.
   */
  ENABLE_CAMERA_FEATURE: true,

  /**
   * Maximum number of recipes to fetch per request.
   */
  MAX_RECIPES_PER_REQUEST: 5,
} as const;

/**
 * Type for feature flag keys
 */
export type FeatureFlagKey = keyof typeof FeatureFlags;

/**
 * Check if a feature flag is enabled
 */
export const isFeatureEnabled = (flag: FeatureFlagKey): boolean => {
  const value = FeatureFlags[flag];
  return typeof value === 'boolean' ? value : false;
};

/**
 * Get the value of a feature flag (for non-boolean flags)
 */
export const getFeatureFlagValue = <K extends FeatureFlagKey>(
  flag: K
): (typeof FeatureFlags)[K] => {
  return FeatureFlags[flag];
};

/**
 * Log feature flags status (only in development)
 */
export const logFeatureFlags = (): void => {
  if (__DEV__) {
    console.log('🚩 Feature Flags:', FeatureFlags);
  }
};

export default FeatureFlags;
