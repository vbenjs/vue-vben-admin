import type { OxlintConfig } from 'oxlint';

const vue: OxlintConfig = {
  rules: {
    'vue/no-reserved-component-names': 'off',
    'vue/prefer-import-from-vue': 'error',
  },
};

export { vue };
