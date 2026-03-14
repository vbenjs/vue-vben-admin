import type { Linter } from 'eslint';

import {
  ignores,
  javascript,
  jsonc,
  node,
  perfectionist,
  pnpm,
  typescript,
  unicorn,
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
    unicorn(),
    yaml(),
    pnpm(),
    ...customConfig,
    ...config,
  ];

  const resolved = await Promise.all(configs);

  return resolved.flat();
}

export { defineConfig };
