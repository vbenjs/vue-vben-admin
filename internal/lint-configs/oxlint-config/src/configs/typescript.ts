import type { OxlintConfig } from 'oxlint';

const typescript: OxlintConfig = {
  rules: {
    'typescript/ban-ts-comment': 'error',
    // Keep the first type-aware rollout conservative. These rules currently
    // produce high-volume diagnostics and need file-by-file cleanup later.
    'typescript/await-thenable': 'off',
    'typescript/no-base-to-string': 'off',
    'typescript/no-duplicate-type-constituents': 'off',
    'typescript/no-floating-promises': 'off',
    'typescript/no-misused-spread': 'off',
    'typescript/no-non-null-assertion': 'error',
    'typescript/no-redundant-type-constituents': 'off',
    'typescript/no-unnecessary-boolean-literal-compare': 'off',
    'typescript/no-unnecessary-type-assertion': 'off',
    'typescript/no-unnecessary-type-arguments': 'off',
    'typescript/no-unnecessary-template-expression': 'off',
    'typescript/no-unsafe-enum-comparison': 'off',
    'typescript/no-unsafe-type-assertion': 'off',
    'typescript/no-var-requires': 'error',
    'typescript/restrict-template-expressions': 'off',
    'typescript/triple-slash-reference': 'error',
    'typescript/unbound-method': 'off',
  },
};

export { typescript };
