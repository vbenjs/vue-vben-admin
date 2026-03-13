import type { OxlintConfig } from 'oxlint';

const plugins: OxlintConfig = {
  plugins: ['import', 'node', 'oxc', 'typescript', 'unicorn', 'vitest', 'vue'],
};

export { plugins };
