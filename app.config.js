const { loadEnvForAppEnv, normalizeAppEnv } = require('./scripts/env');

const appEnv = normalizeAppEnv(process.env.APP_ENV);
loadEnvForAppEnv(appEnv, { override: false });

const expoPublicEnv = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => key.startsWith('EXPO_PUBLIC_'))
);

module.exports = {
  expo: {
    name: 'MyYummiBite',
    slug: 'MyYummiBite',
    version: '0.5.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    scheme: 'myyummibite',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.yourcompany.myyummibite',
      newArchEnabled: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
      package: 'com.yourcompany.myyummibite',
      newArchEnabled: true,
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    experiments: {
      typedRoutes: false,
    },
    plugins: [
      [
        'expo-camera',
        {
          cameraPermission: 'Allow MyYummiBite to access your camera to take photos of recipes.',
        },
      ],
      [
        'expo-media-library',
        {
          photosPermission: 'Allow MyYummiBite to access your photos to save recipe images.',
          savePhotosPermission: 'Allow MyYummiBite to save recipe photos to your library.',
        },
      ],
      'sentry-expo',
    ],
    extra: {
      eas: {
        projectId: 'your-project-id',
      },
      appEnv,
      sentryDsn: process.env.SENTRY_DSN || '',
      ...expoPublicEnv,
    },
  },
};
