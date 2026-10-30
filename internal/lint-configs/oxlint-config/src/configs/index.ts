import type { OxlintConfig } from 'oxlint';

import { command } from './command';
import { comments } from './comments';
import { importPluginConfig } from './import';
import { javascript } from './javascript';
import { node } from './node';
import { overrides } from './overrides';
import { plugins } from './plugins';
import { tailwindcss } from './tailwindcss';
import { test } from './test';
import { typescript } from './typescript';
import { unicorn } from './unicorn';
import { vue } from './vue';

export { oxlintIgnorePatterns } from './ignores';
export { oxlintEnv, oxlintGlobals } from './javascript';
export { tailwindcssSettings } from './tailwindcss';

/**
 * 仅供 eslint-plugin-oxlint 桥接消费：桥接需要 categories/rules/plugins/overrides
 * 扁平合一的对象（见 @vben/eslint-config 的 configs/oxlint.ts）。
 * oxlint 运行时走根 oxlint.config.ts 的原生 extends，不经此函数。
 */
function mergeOxlintConfigs(...configs: OxlintConfig[]): OxlintConfig {
  const merged: OxlintConfig = {};

  for (const config of configs) {
    merged.categories =
      merged.categories && config.categories
        ? { ...merged.categories, ...config.categories }
        : (config.categories ?? merged.categories);
    merged.env =
      merged.env && config.env
        ? { ...merged.env, ...config.env }
        : (config.env ?? merged.env);
    merged.globals =
      merged.globals && config.globals
        ? { ...merged.globals, ...config.globals }
        : (config.globals ?? merged.globals);
    merged.jsPlugins = [
      ...new Set([...(merged.jsPlugins ?? []), ...(config.jsPlugins ?? [])]),
    ];
    merged.overrides = [
      ...(merged.overrides ?? []),
      ...(config.overrides ?? []),
    ];
    // options 必须参与合并：桥接（eslint-plugin-oxlint）依据
    // options.typeAware 推导类型感知规则的关停集合，丢失会导致
    // eslint 与 oxlint/tsgolint 重复检查同一批规则。
    merged.options =
      merged.options && config.options
        ? { ...merged.options, ...config.options }
        : (config.options ?? merged.options);
    merged.plugins = [
      ...new Set([...(merged.plugins ?? []), ...(config.plugins ?? [])]),
    ];
    merged.rules =
      merged.rules && config.rules
        ? { ...merged.rules, ...config.rules }
        : (config.rules ?? merged.rules);
    merged.settings =
      merged.settings && config.settings
        ? { ...merged.settings, ...config.settings }
        : (config.settings ?? merged.settings);
  }

  return merged;
}

// 根 oxlint.config.ts 经原生 extends 消费；ignorePatterns 集中声明在根级
// （原生 extends 不合并该字段）。
const oxlintConfigs: OxlintConfig[] = [
  javascript,
  command,
  comments,
  plugins,
  importPluginConfig,
  node,
  overrides,
  tailwindcss,
  test,
  typescript,
  unicorn,
  vue,
];

const oxlintConfig = mergeOxlintConfigs(...oxlintConfigs);

export {
  command,
  comments,
  importPluginConfig,
  javascript,
  node,
  overrides,
  oxlintConfig,
  oxlintConfigs,
  plugins,
  tailwindcss,
  test,
  typescript,
  unicorn,
  vue,
};
