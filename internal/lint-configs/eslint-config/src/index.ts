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
  // 各配置工厂均为异步，内置配置与桥接并行解析；customConfig / 用户配置
  // 是同步数组，直接拼接。
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
    // 桥接放在内置配置之后、customConfig 与用户配置之前：先让其它配置
    // 设置规则，再统一关停 oxlint 已覆盖的规则；customConfig 与用户
    // 配置仍可最终覆盖（与 main 上 customConfig 先于用户配置拍板的
    // 契约一致）。
    ...oxcConfigs,
    ...customConfig,
    ...config,
  ];
}

export { defineConfig };
