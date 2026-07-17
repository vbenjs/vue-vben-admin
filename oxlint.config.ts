import { defineConfig } from '@vben/oxlint-config';

export default defineConfig({
  rules: {
    // oxfmt prefers lowercase hex and removes unnecessary ternary parens;
    // these oxlint rules conflict with the project's chosen formatter.
    'unicorn/no-nested-ternary': 'off',
    'unicorn/number-literal-case': 'off',
  },
});
