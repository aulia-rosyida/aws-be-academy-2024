const globals = require('globals');
const pluginJs = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  ...compat.extends('airbnb-base'),
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 12,
    },
    rules: {
      'no-console': 'off',
      'no-else-return': 'off',
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        myCustomGlobal: 'readonly',
      },
    },
  },
  pluginJs.configs.recommended,
];
