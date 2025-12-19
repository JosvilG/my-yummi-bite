const appEnv = (process.env.EXPO_PUBLIC_APP_ENV ?? "development").toLowerCase();
const useMocks = appEnv === "production" || appEnv === "preprod" ? false : __DEV__;

export const FeatureFlags = {
  USE_MOCK_RECIPES: useMocks,
  ENABLE_DEBUG_LOGS: __DEV__,
  SHOW_DEV_TOOLS: __DEV__,
  SKIP_AUTH: false,
  ENABLE_SWIPE_ANIMATIONS: true,
  ENABLE_OFFLINE_MODE: false,
  SHOW_NUTRITION_INFO: true,
  ENABLE_CAMERA_FEATURE: true,
  MAX_RECIPES_PER_REQUEST: 5,
  DEFAULT_LANGUAGE: 'auto' as 'en' | 'es' | 'auto',
} as const;

export type FeatureFlagKey = keyof typeof FeatureFlags;

export const isFeatureEnabled = (flag: FeatureFlagKey): boolean => {
  const value = FeatureFlags[flag];
  return typeof value === 'boolean' ? value : false;
};

export const getFeatureFlagValue = <K extends FeatureFlagKey>(
  flag: K
): (typeof FeatureFlags)[K] => {
  return FeatureFlags[flag];
};

export const logFeatureFlags = (): void => {
  if (__DEV__) {
    console.log('Feature Flags:', FeatureFlags);
  }
};

export default FeatureFlags;
