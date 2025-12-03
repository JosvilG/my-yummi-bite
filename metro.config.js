const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable Expo Router file-based routing
// We're using React Navigation with manual routes
config.resolver.sourceExts = config.resolver.sourceExts.filter(ext => ext !== 'expo-router');

module.exports = config;
