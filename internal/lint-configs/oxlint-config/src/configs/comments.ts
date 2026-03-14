import type { OxlintConfig } from 'oxlint';

const comments: OxlintConfig = {
  jsPlugins: [
    {
      name: 'eslint-comments',
      specifier: '@eslint-community/eslint-plugin-eslint-comments',
    },
  ],
  rules: {
    'eslint-comments/no-aggregating-enable': 'error',
    'eslint-comments/no-duplicate-disable': 'error',
    'eslint-comments/no-unlimited-disable': 'error',
    'eslint-comments/no-unused-enable': 'error',
  },
};

export { comments };
