// @ts-check

import { defineConfig } from '@vben/eslint-config';

export default (async () => {
  const config = await defineConfig();
  return [
    ...config,
    { ignores: ['apps/server/**', '**/apps/server/**', '.agent/**'] },
    {
      files: ['apps/web-antd/src/views/**/*.vue'],
      rules: {
        'unicorn/no-array-reduce': 'off',
        'unicorn/no-array-sort': 'off',
        'unicorn/no-nested-ternary': 'off',
        'unicorn/prefer-add-event-listener': 'off',
        'vue/html-closing-bracket-newline': 'off',
        'vue/html-quotes': 'off',
        'vue/multiline-html-element-content-newline': 'off',
      },
    },
    {
      files: ['scripts/**/*.cjs'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ];
})();
