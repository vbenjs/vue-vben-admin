import baseLintConfig from './index';

export default {
  extends: [baseLintConfig],
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    '@typescript-eslint/ban-types': 'error',
    '@typescript-eslint/ban-ts-ignore': 'error',
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/no-explicit-any': 'error',

    'vue/attributes-order': 'error',
    'vue/require-default-prop': 'error',
  },
};
