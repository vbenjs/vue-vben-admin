import type { OxlintConfig } from 'oxlint';

const overrides: OxlintConfig = {
  overrides: [
    {
      files: ['*.d.ts', '**/*.d.ts'],
      rules: {
        'import/no-unassigned-import': 'off',
        'typescript/triple-slash-reference': 'off',
      },
    },
    {
      files: [
        '**/__tests__/**/*.js',
        '**/__tests__/**/*.cjs',
        '**/__tests__/**/*.mjs',
        '**/__tests__/**/*.jsx',
        '**/__tests__/**/*.ts',
        '**/__tests__/**/*.cts',
        '**/__tests__/**/*.mts',
        '**/__tests__/**/*.tsx',
        '**/*.spec.js',
        '**/*.spec.cjs',
        '**/*.spec.mjs',
        '**/*.spec.jsx',
        '**/*.spec.ts',
        '**/*.spec.cts',
        '**/*.spec.mts',
        '**/*.spec.tsx',
        '**/*.test.js',
        '**/*.test.cjs',
        '**/*.test.mjs',
        '**/*.test.jsx',
        '**/*.test.ts',
        '**/*.test.cts',
        '**/*.test.mts',
        '**/*.test.tsx',
        '**/*.bench.js',
        '**/*.bench.cjs',
        '**/*.bench.mjs',
        '**/*.bench.jsx',
        '**/*.bench.ts',
        '**/*.bench.cts',
        '**/*.bench.mts',
        '**/*.bench.tsx',
        '**/*.benchmark.js',
        '**/*.benchmark.cjs',
        '**/*.benchmark.mjs',
        '**/*.benchmark.jsx',
        '**/*.benchmark.ts',
        '**/*.benchmark.cts',
        '**/*.benchmark.mts',
        '**/*.benchmark.tsx',
      ],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['packages/@core/base/shared/src/utils/inference.ts'],
      rules: {
        'vue/prefer-import-from-vue': 'off',
      },
    },
    {
      files: ['packages/@core/ui-kit/menu-ui/src/sub-menu.vue'],
      rules: {
        'import/no-self-import': 'off',
      },
    },
    {
      files: [
        'scripts/**/*.js',
        'scripts/**/*.cjs',
        'scripts/**/*.mjs',
        'scripts/**/*.jsx',
        'scripts/**/*.ts',
        'scripts/**/*.cts',
        'scripts/**/*.mts',
        'scripts/**/*.tsx',
        'internal/**/*.js',
        'internal/**/*.cjs',
        'internal/**/*.mjs',
        'internal/**/*.jsx',
        'internal/**/*.ts',
        'internal/**/*.cts',
        'internal/**/*.mts',
        'internal/**/*.tsx',
      ],
      rules: {
        'no-console': 'off',
        'unicorn/no-process-exit': 'off',
      },
    },
  ],
};

export { overrides };
