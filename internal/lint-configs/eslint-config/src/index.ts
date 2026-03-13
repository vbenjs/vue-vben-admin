import type { Linter } from 'eslint';

import {
  command,
  comments,
  ignores,
  javascript,
  jsonc,
  node,
  oxcCompat,
  perfectionist,
  pnpm,
  turbo,
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
    comments(),
    unicorn(),
    command(),
    turbo(),
    yaml(),
    pnpm(),
    ...customConfig,
    oxcCompat(),
    ...config,
  ];

  const resolved = await Promise.all(configs);

  return resolved.flat();
}

export { defineConfig };
