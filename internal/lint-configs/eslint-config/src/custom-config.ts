import type { Linter } from 'eslint';

const customConfig: Linter.FlatConfig[] = [
  {
    files: ['packages/@vben-core/uikit/shadcn-ui/**/**'],
    rules: {
      'vue/require-default-prop': 'off',
    },
  },
];

export { customConfig };
