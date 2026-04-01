import type { OxlintConfig } from 'oxlint';

const javascript: OxlintConfig = {
  categories: {
    correctness: 'error',
    suspicious: 'warn',
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  globals: {
    document: 'readonly',
    navigator: 'readonly',
    window: 'readonly',
  },
  rules: {
    'accessor-pairs': [
      'error',
      {
        enforceForClassMembers: true,
        setWithoutGet: true,
      },
    ],
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    'default-case-last': 'error',
    eqeqeq: ['error', 'always'],
    'eslint/no-unreachable': 'error',
    'new-cap': [
      'error',
      {
        capIsNew: false,
        newIsCap: true,
        properties: true,
      },
    ],
    'no-alert': 'error',
    'no-array-constructor': 'error',
    'no-caller': 'error',
    'no-case-declarations': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-control-regex': 'off',
    'no-debugger': 'error',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-fallthrough': 'error',
    'no-new-func': 'error',
    'no-object-constructor': 'error',
    'no-new-native-nonconstructor': 'error',
    'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
    'no-lone-blocks': 'error',
    'no-multi-str': 'error',
    'no-nonoctal-decimal-escape': 'error',
    'no-proto': 'error',
    'no-prototype-builtins': 'error',
    'no-redeclare': ['error', { builtinGlobals: false }],
    'no-regex-spaces': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-shadow': 'off',
    'no-shadow-restricted-names': 'error',
    'eslint/no-empty-function': [
      'error',
      {
        allow: ['arrowFunctions', 'functions', 'methods'],
      },
    ],
    'no-template-curly-in-string': 'error',
    'no-throw-literal': 'error',
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTaggedTemplates: true,
        allowTernary: true,
      },
    ],
    'eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'no-var': 'error',
    'no-eval': 'error',
    'no-iterator': 'error',
    'no-new-wrappers': 'error',
    'no-restricted-globals': [
      'error',
      { message: 'Use `globalThis` instead.', name: 'global' },
      { message: 'Use `globalThis` instead.', name: 'self' },
    ],
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
    'no-useless-return': 'error',
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
        ignoreReadBeforeAssign: true,
      },
    ],
    'prefer-exponentiation-operator': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'symbol-description': 'error',
    'unicode-bom': ['error', 'never'],
    'use-isnan': [
      'error',
      {
        enforceForIndexOf: true,
        enforceForSwitchCase: true,
      },
    ],
    'valid-typeof': [
      'error',
      {
        requireStringLiterals: true,
      },
    ],
    'vars-on-top': 'error',
    yoda: ['error', 'never'],
  },
};

export { javascript };
