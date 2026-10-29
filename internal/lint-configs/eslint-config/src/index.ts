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
  // 内置配置与桥接均为异步：统一解析后按序组装为扁平数组。
  const [
    vueConfigs,
    javascriptConfigs,
    ignoresConfigs,
    typescriptConfigs,
    jsoncConfigs,
    nodeConfigs,
    perfectionistConfigs,
    yamlConfigs,
    pnpmConfigs,
    oxcConfigs,
  ] = await Promise.all([
    vue(),
    javascript(),
    ignores(),
    typescript(),
    jsonc(),
    node(),
    perfectionist(),
    yaml(),
    pnpm(),
    oxcCompat(),
  ]);

  return [
    ...vueConfigs,
    ...javascriptConfigs,
    ...ignoresConfigs,
    ...typescriptConfigs,
    ...jsoncConfigs,
    ...nodeConfigs,
    ...perfectionistConfigs,
    ...yamlConfigs,
    ...pnpmConfigs,
    ...customConfig,
    // 桥接放在内置配置之后、用户配置之前：先让其它配置设置规则，
    // 再统一关停 oxlint 已覆盖的规则，同时保留下游覆盖能力。
    ...oxcConfigs,
    ...config,
  ];
}

export { defineConfig };
