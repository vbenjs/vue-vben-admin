import type { OxlintConfig } from 'oxlint';

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { getDefaultSelectors } from 'eslint-plugin-better-tailwindcss/defaults';
import { SelectorKind } from 'eslint-plugin-better-tailwindcss/types';

const selectors = [
  ...getDefaultSelectors(),
  {
    kind: SelectorKind.Attribute,
    match: [{ type: 'objectValues' }],
    name: '^classNames$',
  },
];

// src 与 dist 的目录深度不同（tsdown 会把入口拍平到 dist 根，固定层级的
// 相对 URL 在其中一种形态下必然错位），自本文件逐级向上探测仓库内的
// 主题入口；探测失败直接抛错，好过把 undefined 交给插件静默降级。
function resolveThemeEntry(): string {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let depth = 0; depth < 8; depth++) {
    const candidate = join(dir, 'internal/tailwind-config/src/theme.css');
    if (existsSync(candidate)) {
      return candidate;
    }
    const parent = dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  throw new Error(
    'better-tailwindcss entry point not found: internal/tailwind-config/src/theme.css',
  );
}

const entryPoint = resolveThemeEntry();

const settings = {
  entryPoint,
  selectors,
};

// jsPlugins 的 settings 必须由根 oxlint.config.ts 直接声明：
// 原生 extends 虽合并 settings 字段，但不会把它投递给 JS 插件
// （oxlint 1.90 实测：仅经 extends 提供时 better-tailwindcss 报
// 「No tailwind css entry point found at `undefined`」，类排序回落
// unknownClass 兜底）。故此处导出、由根级 settings 消费。
const tailwindcssSettings = {
  'better-tailwindcss': settings,
  'eslint-plugin-better-tailwindcss': settings,
};

const tailwindcss: OxlintConfig = {
  jsPlugins: [
    {
      name: 'better-tailwindcss',
      specifier: 'eslint-plugin-better-tailwindcss',
    },
  ],
  rules: {
    ...eslintPluginBetterTailwindcss.configs.recommended.rules,
    'better-tailwindcss/enforce-consistent-class-order': [
      'error',
      {
        detectComponentClasses: true,
        unknownClassOrder: 'asc',
        unknownClassPosition: 'start',
      },
    ],
    // Let Prettier own wrapping decisions to avoid ping-pong formatting.
    'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
    'better-tailwindcss/no-unknown-classes': 'off',
  },
  settings: tailwindcssSettings,
};

export { tailwindcss, tailwindcssSettings };
