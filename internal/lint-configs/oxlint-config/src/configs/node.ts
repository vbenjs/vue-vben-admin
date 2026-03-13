import type { OxlintConfig } from 'oxlint';

const node: OxlintConfig = {
  rules: {
    'node/no-exports-assign': 'error',
    'node/no-new-require': 'error',
    'node/no-path-concat': 'error',
  },
};

export { node };
