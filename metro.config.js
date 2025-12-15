const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable Expo Router file-based routing
// We're using React Navigation with manual routes
config.resolver.sourceExts = config.resolver.sourceExts.filter(ext => ext !== 'expo-router');

// Ensure Metro resolves .web.js when running `expo start --web` (metro bundler)
config.resolver.platforms = Array.from(new Set([...(config.resolver.platforms || []), 'web', 'native']));

module.exports = config;
