import type { OxlintConfig } from 'oxlint';

const unicorn: OxlintConfig = {
  rules: {
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/no-process-exit': 'error',
    'unicorn/no-single-promise-in-promise-methods': 'off',
    'unicorn/no-useless-spread': 'off',
    'unicorn/prefer-global-this': 'off',
    'unicorn/prefer-module': 'error',
  },
};

export { unicorn };
