// @ts-check

import globals from 'globals';
// import prettier from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
// For a detailed explanation, visit: https://github.com/angular-eslint/angular-eslint/blob/main/docs/CONFIGURING_FLAT_CONFIG.md
import angular from 'angular-eslint';
// jhipster-needle-eslint-add-import - JHipster will add additional import here

export default tseslint.config(
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  { ignores: ['src/main/docker/'] },
  { ignores: ['target/classes/static/', 'target/'] },
  eslint.configs.recommended,
  {
    files: ['**/*.{js,cjs,mjs}'],
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['src/main/webapp/**/*.ts'],
    extends: [...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylistic, ...angular.configs.tsRecommended],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.spec.json'],
      },
    },
    processor: {
      // https://github.com/angular-eslint/angular-eslint/issues/1917
      meta: {
        name: 'extract-inline-html',
      },
      ...angular.processInlineTemplates,
    },
    rules: {
      '@angular-eslint/component-selector': [
        'warn',
        {
          type: 'element',
          prefix: 'jhi',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/directive-selector': [
        'warn',
        {
          type: 'attribute',
          prefix: 'jhi',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/relative-url-prefix': 'warn',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/member-ordering': [
        'warn',
        {
          default: [
            'public-static-field',
            'protected-static-field',
            'private-static-field',
            'public-instance-field',
            'protected-instance-field',
            'private-instance-field',
            'constructor',
            'public-static-method',
            'protected-static-method',
            'private-static-method',
            'public-instance-method',
            'protected-instance-method',
            'private-instance-method',
          ],
        },
      ],
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-shadow': ['warn'],
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/restrict-template-expressions': ['warn', { allowNumber: true }],
      '@typescript-eslint/unbound-method': 'off',
      'arrow-body-style': 'warn',
      curly: 'warn',
      eqeqeq: ['warn', 'always', { null: 'ignore' }],
      'guard-for-in': 'warn',
      'no-bitwise': 'warn',
      'no-caller': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-eval': 'warn',
      'no-labels': 'warn',
      'no-new': 'warn',
      'no-new-wrappers': 'warn',
      'object-shorthand': ['warn', 'always', { avoidExplicitReturnArrows: true }],
      radix: 'warn',
      'spaced-comment': ['warn', 'always'],
    },
  },
  {
    files: ['src/main/webapp/**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
  {
    // Html templates requires some work
    ignores: ['**/*.html'],
    // extends: [prettier],
  },
  // jhipster-needle-eslint-add-config - JHipster will add additional config here
  // prettier,
);
