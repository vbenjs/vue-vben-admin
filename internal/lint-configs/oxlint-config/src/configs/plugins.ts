import type { OxlintConfig } from 'oxlint';

const plugins: OxlintConfig = {
  /**
   * oxlint 支持的插件，将默认开启的也显示配置
   * type: eslint | react | unicorn | typescript | oxc |
   * import | jsdoc | jest | vitest | jsx-a11y | nextjs |
   * react-perf | promise | node | vue
   *
   * Default: eslint,typescript,unicorn,oxc
   */
  plugins: [
    'eslint',
    'import',
    'node',
    'oxc',
    'typescript',
    'unicorn',
    'vitest',
    'vue',
  ],
};

export { plugins };
