import type { OxlintConfig } from 'oxlint';

const test: OxlintConfig = {
  rules: {
    'jest/no-conditional-expect': 'off',
    'jest/require-to-throw-message': 'off',
    'vitest/consistent-test-it': [
      'error',
      {
        fn: 'it',
        withinDescribe: 'it',
      },
    ],
    'vitest/hoisted-apis-on-top': 'off',
    'vitest/no-focused-tests': 'error',
    'vitest/no-identical-title': 'error',
    'vitest/no-import-node-test': 'error',
    'vitest/prefer-hooks-in-order': 'error',
    'vitest/prefer-lowercase-title': 'error',
    'vitest/require-mock-type-parameters': 'off',
  },
};

export { test };
