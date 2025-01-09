// import js from '@eslint/js';
// import globals from 'globals';
// import reactHooks from 'eslint-plugin-react-hooks';
// import reactRefresh from 'eslint-plugin-react-refresh';
// import tseslint from 'typescript-eslint';

// export default tseslint.config(
//   { ignores: ['dist'] },
//   {
//     extends: [js.configs.recommended, ...tseslint.configs.recommended],
//     files: ['**/*.{ts,tsx}'],
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: globals.browser,
//     },
//     plugins: {
//       'react-hooks': reactHooks,
//       'react-refresh': reactRefresh,
//     },
//     rules: {
//       ...reactHooks.configs.recommended.rules,
//       'react-refresh/only-export-components': [
//         'warn',
//         { allowConstantExport: true },
//       ],
//     },
//   }
// );

// import { defineConfig } from 'eslint-define-config';
// import js from '@eslint/js';
// import globals from 'globals';
// import reactHooks from 'eslint-plugin-react-hooks';
// import reactRefresh from 'eslint-plugin-react-refresh';

// export default defineConfig({
//   parser: '@typescript-eslint/parser',
//   parserOptions: {
//     ecmaVersion: 2020,
//     sourceType: 'module',
//     project: './tsconfig.json', // Make sure your tsconfig file is correctly referenced
//   },
//   extends: [
//     js.configs.recommended,
//     'plugin:@typescript-eslint/recommended',
//   ],
//   plugins: {
//     'react-hooks': reactHooks,
//     'react-refresh': reactRefresh,
//   },
//   overrides: [
//     {
//       files: ['**/*.{ts,tsx}'],
//     },
//   ],
//   rules: {
//     ...reactHooks.configs.recommended.rules,
//     'react-refresh/only-export-components': [
//       'warn', { allowConstantExport: true },
//     ],
//   },
//   ignorePatterns: ['dist'], // Ignore build artifacts
//   globals: globals.browser,
// });

import pkg from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

const { defineConfig } = pkg;

export default defineConfig({
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      project: './tsconfig.json',  // Ensure this points to your tsconfig.json
    },
    globals: globals.browser,
  },
  extends: [
    '@eslint/js/recommended',
    'plugin:@typescript-eslint/recommended', // Use the recommended rules for TypeScript
  ],
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    '@typescript-eslint': typescriptEslint,
  },
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
    },
  ],
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react-refresh/only-export-components': [
      'warn', { allowConstantExport: true },
    ],
  },
  ignorePatterns: ['dist'],  // Ignore build artifacts
});
