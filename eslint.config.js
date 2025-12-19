const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  {
    ignores: ['node_modules/**', '.expo/**', 'web-build/**', 'model/**', 'screens/**', 'eslint.config.js'],
  },
  ...compat.extends('expo', 'prettier'),
  {
    plugins: {
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      'prettier/prettier': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react/prop-types': 'off',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
