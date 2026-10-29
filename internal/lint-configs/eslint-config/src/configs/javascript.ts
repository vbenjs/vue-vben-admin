import type { Linter } from 'eslint';

import js from '@eslint/js';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

export async function javascript(): Promise<Linter.Config[]> {
  return [
    {
      languageOptions: {
        ecmaVersion: 'latest',
        globals: {
          ...globals.browser,
          ...globals.es2021,
          ...globals.node,
          document: 'readonly',
          navigator: 'readonly',
          window: 'readonly',
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ecmaVersion: 'latest',
          sourceType: 'module',
        },
        sourceType: 'module',
      },
      linterOptions: {
        reportUnusedDisableDirectives: true,
      },
      plugins: {
        'unused-imports': pluginUnusedImports,
      },
      rules: {
        // oxlint 已覆盖的规则由 oxcCompat 桥接统一关停，无需手工清单。
        ...js.configs.recommended.rules,
        'dot-notation': ['error', { allowKeywords: true }],
        'keyword-spacing': 'off',
        'no-empty-function': 'off',
        'no-octal': 'error',
        'no-octal-escape': 'error',
        'no-restricted-properties': [
          'error',
          {
            message:
              'Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.',
            property: '__proto__',
          },
          {
            message: 'Use `Object.defineProperty` instead.',
            property: '__defineGetter__',
          },
          {
            message: 'Use `Object.defineProperty` instead.',
            property: '__defineSetter__',
          },
          {
            message: 'Use `Object.getOwnPropertyDescriptor` instead.',
            property: '__lookupGetter__',
          },
          {
            message: 'Use `Object.getOwnPropertyDescriptor` instead.',
            property: '__lookupSetter__',
          },
        ],
        'no-restricted-syntax': [
          'error',
          'DebuggerStatement',
          'LabeledStatement',
          'WithStatement',
          'TSEnumDeclaration[const=true]',
          'TSExportAssignment',
        ],
        'no-undef-init': 'error',
        'no-undef': 'off',
        // oxlint 负责 ts/js 的未用变量检查；.vue 文件由下方
        // unused-imports/no-unused-vars（带 ^_ 忽略模式）负责，核心规则全程关闭。
        'no-unused-vars': 'off',
        'no-unreachable-loop': 'error',
        'object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        'one-var': ['error', { initialized: 'never' }],
        'prefer-arrow-callback': [
          'error',
          {
            allowNamedFunctions: false,
            allowUnboundThis: true,
          },
        ],
        'prefer-regex-literals': [
          'error',
          {
            disallowRedundantWrapping: true,
          },
        ],
        'spaced-comment': 'error',
        'space-before-function-paren': 'off',

        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'error',
          {
            args: 'after-used',
            argsIgnorePattern: '^_',
            vars: 'all',
            varsIgnorePattern: '^_',
          },
        ],
      },
    },
  ];
}
