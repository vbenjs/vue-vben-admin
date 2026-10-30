import {
  oxlintConfigs,
  oxlintEnv,
  oxlintGlobals,
  oxlintIgnorePatterns,
  tailwindcssSettings,
} from '@vben/oxlint-config';

import { defineConfig } from 'oxlint';

export default defineConfig({
  // 原生 extends 的字段合并例外，例外项一律在根级直供（oxlint 1.90 实测）：
  // - ignorePatterns / env / globals：extends 完全不合并，需根级声明；
  // - settings：extends 虽合并该字段，但不会投递给 JS 插件；
  // - options（含 typeAware）：合并且生效，无例外。
  // 清单与 env/globals 由包导出共享，eslint 桥接同样消费，保持两工具口径一致。
  extends: [...oxlintConfigs],
  ignorePatterns: [...oxlintIgnorePatterns],
  env: oxlintEnv,
  globals: oxlintGlobals,
  settings: tailwindcssSettings,
});
