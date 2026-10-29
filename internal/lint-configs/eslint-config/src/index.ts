import type { Linter } from 'eslint';

import {
  ignores,
  javascript,
  jsonc,
  node,
  oxcCompat,
  perfectionist,
  pnpm,
  typescript,
  vue,
  yaml,
} from './configs';
import { customConfig } from './custom-config';

type FlatConfig = Linter.Config;

async function defineConfig(config: FlatConfig[] = []): Promise<FlatConfig[]> {
  // 内置配置与桥接均为异步，两路并行解析；customConfig / 用户配置是同步
  // 数组，直接拼接（同步值混入 Promise.all 会触发 await-thenable）。
  const [builtinConfigs, oxcConfigs] = await Promise.all([
    Promise.all([
      vue(),
      javascript(),
      ignores(),
      typescript(),
      jsonc(),
      node(),
      perfectionist(),
      yaml(),
      pnpm(),
    ]),
    oxcCompat(),
  ]);

  return [
    ...builtinConfigs.flat(),
    ...customConfig,
    // 桥接放在内置配置与 customConfig 之后、用户配置之前：先让其它配置
    // 设置规则，再统一关停 oxlint 已覆盖的规则，用户配置仍可最终覆盖。
    ...oxcConfigs,
    ...config,
  ];
}

export { defineConfig };
