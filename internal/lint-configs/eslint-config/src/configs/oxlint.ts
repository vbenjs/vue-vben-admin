import type { Linter } from 'eslint';

import { oxlintConfig, oxlintIgnorePatterns } from '@vben/oxlint-config';

import oxlint from 'eslint-plugin-oxlint';

/**
 * 官方桥接：读取 oxlint 配置，把 oxlint 已激活的规则在 ESLint 侧关停，
 * 替代手工维护的 rulesCoveredByOxlint 清单。
 *
 * 传入剔除 ignorePatterns 的扁平合并配置（防御性剔除：ignorePatterns
 * 若保留，会被桥接导出为 ESLint 全局 ignores，静默收窄 jsonc/yaml/docs
 * 等场景的检查覆盖）；categories 与规则取自根级对象，桥接据此推导关停集合。
 *
 * 桥接产出的条目默认不带范围（作用于全部 eslint 检查的文件），但 json/
 * yaml/md/docs 等路径 oxlint 根本不检查——若不限定范围，这些 eslint 独管
 * 路径上的规则会被错误关停。因此把根级 ignorePatterns 作为每条配置的
 * 排除项回填：条目含 rules，ignores 在此语义为「排除」而非全局忽略，
 * oxlint 跳过的路径恢复由 eslint 全量把关。
 */
async function oxcCompat(): Promise<Linter.Config[]> {
  const { ignorePatterns: _ignorePatterns, ...config } = oxlintConfig;
  const entries = oxlint.buildFromOxlintConfig(config);

  return entries.map((entry) => ({
    ...entry,
    ignores: [...(entry.ignores ?? []), ...oxlintIgnorePatterns],
  }));
}

export { oxcCompat };
