import { oxlintConfigs, oxlintIgnorePatterns } from '@vben/oxlint-config';

import { defineConfig } from 'oxlint';

export default defineConfig({
  // 原生 extends 除 ignorePatterns 外全字段合并，故忽略集中声明在根级
  // （清单由包导出共享，eslint 桥接同样消费，保持两工具口径一致）。
  extends: [...oxlintConfigs],
  ignorePatterns: [...oxlintIgnorePatterns],
});
