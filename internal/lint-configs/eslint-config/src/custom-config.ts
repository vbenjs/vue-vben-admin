import type { Linter } from 'eslint';

const customConfig: Linter.FlatConfig[] = [
  {
    files: ['packages/@core/ui-kit/shadcn-ui/**/**'],
    rules: {
      'vue/require-default-prop': 'off',
    },
  },
  {
    files: ['apps/backend-mock/**/**'],
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
      'no-console': 'off',
    },
  },
];

export { customConfig };
