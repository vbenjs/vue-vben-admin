import type { OxlintConfig } from 'oxlint';

const typescript: OxlintConfig = {
  rules: {
    'typescript/ban-ts-comment': 'error',
    'typescript/no-non-null-assertion': 'error',
    'typescript/no-var-requires': 'error',
    'typescript/triple-slash-reference': 'error',
  },
};

export { typescript };
