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

type FlatConfigPromise =
  | FlatConfig
  | FlatConfig[]
  | Promise<FlatConfig>
  | Promise<FlatConfig[]>;

async function defineConfig(config: FlatConfig[] = []) {
  const configs: FlatConfigPromise[] = [
    vue(),
    javascript(),
    ignores(),
    typescript(),
    jsonc(),
    node(),
    perfectionist(),
    yaml(),
    pnpm(),
    ...customConfig,
    // 桥接放在内置配置之后、用户配置之前：先让其它配置设置规则，
    // 再统一关停 oxlint 已覆盖的规则，同时保留下游覆盖能力。
    oxcCompat(),
    ...config,
  ];

  const resolved = await Promise.all(configs);

  return resolved.flat();
}

export { defineConfig };
