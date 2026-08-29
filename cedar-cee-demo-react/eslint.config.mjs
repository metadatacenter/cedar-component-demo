// @ts-check
/**
 * ESLint flat config, replacing the `eslintConfig` block create-react-app put in
 * package.json. That block named `react-app`, a shareable config that only existed
 * inside react-scripts, so nothing ran it once react-scripts was gone.
 */
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import testingLibrary from 'eslint-plugin-testing-library';

export default [
  {
    ignores: ['build/**', 'node_modules/**']
  },
  {
    files: ['**/*.{js,jsx}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules
    }
  },
  {
    files: ['**/*.test.{js,jsx}'],
    ...testingLibrary.configs['flat/react'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    }
  },
  {
    files: ['vite.config.js', 'src/setup-tests.js'],
    languageOptions: {
      globals: { ...globals.node }
    }
  }
];
