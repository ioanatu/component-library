import storybook from 'eslint-plugin-storybook';
import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config(
  {
    ignores: ['dist', '.yarn', 'storybook-static', 'coverage'],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      react: { version: '19' },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/button-has-type': 'off',
      'react/require-default-props': 'off',
      'react/no-unknown-property': 'error',
      'object-curly-newline': 'off',
      '@typescript-eslint/no-use-before-define': 'error',
      'operator-linebreak': 'off',
      'function-paren-newline': 'off',
      'react/jsx-uses-react': 'off',
      'react/function-component-definition': 'off',
      'import/prefer-default-export': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      'react-hooks/exhaustive-deps': 'off',
      'react/jsx-no-useless-fragment': 'off',
      'no-underscore-dangle': 'off',
      'arrow-body-style': 'off',
      'max-len': 'off',
      'implicit-arrow-linebreak': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'no-console': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^\\u0000', '^@?\\w', '^[^.]', '^\\.']],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
  storybook.configs['flat/recommended'],
);
