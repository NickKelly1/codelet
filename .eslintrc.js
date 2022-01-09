'use-strict';

/* eslint-env node */

/** @typedef {import('eslint').Linter.Config} Config */

/** @type {Config} */
const config = {
  ignorePatterns: ['dist/*', 'node_modules/*',],
  overrides: [
    {
      files: ['*.js', '*.jsx',],
      'rules': {
        'indent': ['error', 2, ],
        // doesn't work on .js files
        '@typescript-eslint/explicit-module-boundary-types': ['off',],
      },
    },
  ],
  env: {
    // chose which are appropriate
    'browser': false,
    'node': true,
    'jest': true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'eslint:recommended',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 2021,
    'sourceType': ['module', 'commonjs',],
    'ecmaFeatures': {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    indent: ['off',],
    'linebreak-style': ['error', 'unix',],
    quotes: ['error', 'single',],
    semi: ['error', 'always',],
    'comma-dangle': ['error', {
      'functions': 'only-multiline',
      'objects': 'always',
      'arrays': 'always',
    },],
    'prefer-arrow-callback': ['off',],
    'max-len': ['error', { code: 120, },],
    eqeqeq: ['error', 'smart',],
    'no-trailing-spaces': ['error',],
    'no-unused-vars': ['off',], // favour typescript's no-unused-vars
    'no-undef': ['off',], // favour typescript
    'no-redeclare': ['off',], // favour typescript
    'no-dupe-class-members': ['off',], // favour typescript
    '@typescript-eslint/ban-ts-comment': ['off',],
    '@typescript-eslint/no-non-null-assertion': ['off',],
    '@typescript-eslint/no-this-alias': ['off',],
    '@typescript-eslint/no-empty-function': ['off',],
    'import/no-commonjs': ['off',],
    '@typescript-eslint/indent': ['error', 2, ],
    '@typescript-eslint/no-explicit-any': ['off',],
    '@typescript-eslint/no-namespace': ['off',],
    '@typescript-eslint/no-empty-interface': ['off',],
  },
};

module.exports = config;
