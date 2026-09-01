// @ts-check
/**
 * ESLint flat config. `angular-eslint` 22 requires ESLint 9, which makes flat config
 * the default, and the four `@angular-eslint/*` packages and two `@typescript-eslint/*`
 * packages are each one package upstream now.
 *
 * `.mjs` rather than `.js` because package.json declares no `type`, so a bare `.js`
 * here would be parsed as CommonJS and these imports would fail.
 */
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'out-tsc/**', 'node_modules/**']
  },
  {
    // `**/*.ts`, not `*.ts`: flat config globs are literal, so a bare `*.ts` would
    // match only the repository root.
    files: ['**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' }
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' }
      ]
    }
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended],
    rules: {
      // `!= null` is deliberate: it rejects undefined too, which is what a
      // configuration that has not loaded reads as.
      '@angular-eslint/template/eqeqeq': ['error', { allowNullOrUndefined: true }]
    }
  }
);
