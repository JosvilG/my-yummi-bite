module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!.*(?:(jest-)?react-native|@react-native|expo|@expo|react-navigation|@react-navigation|sentry-expo|native-base|js-polyfills|firebase|@firebase))',
  ],
  testPathIgnorePatterns: ['<rootDir>/functions/', '<rootDir>/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**',
  ],
  moduleNameMapper: {
    '^firebase/(.*)$': '<rootDir>/node_modules/firebase/$1',
  },
};
