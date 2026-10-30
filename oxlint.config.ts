import {
  oxlintConfigs,
  oxlintIgnorePatterns,
  tailwindcssSettings,
} from '@vben/oxlint-config';

import { defineConfig } from 'oxlint';

export default defineConfig({
  // 原生 extends 除 ignorePatterns 外全字段合并，故忽略清单集中声明在
  // 根级（清单由包导出共享，eslint 桥接同样消费，保持两工具口径一致）。
  // settings 是另一处例外：extends 虽合并该字段，但不会投递给 JS 插件
  // （oxlint 1.90 实测），须在根级直接声明。
  extends: [...oxlintConfigs],
  ignorePatterns: [...oxlintIgnorePatterns],
  settings: tailwindcssSettings,
});
