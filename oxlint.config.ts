import { oxlintConfigs } from '@vben/oxlint-config';

import { defineConfig } from 'oxlint';

export default defineConfig({
  // 原生 extends 除 ignorePatterns 外全字段合并，故忽略集中声明在根级。
  extends: [...oxlintConfigs],
  ignorePatterns: [
    '**/dist/**',
    '**/node_modules/**',
    'docs/**',
    'playground/public/**',
    '**/*.json',
    '**/*.md',
    '**/*.svg',
    '**/*.yaml',
    '**/*.yml',
    // Generated shadcn-ui internals are intentionally left unmanaged.
    'packages/@core/ui-kit/shadcn-ui/**/*',
  ],
});
