import type { Linter } from 'eslint';

import { oxlintConfig } from '@vben/oxlint-config';

import oxlint from 'eslint-plugin-oxlint';

/**
 * 官方桥接：读取 oxlint 配置，把 oxlint 已激活的规则在 ESLint 侧关停，
 * 替代手工维护的 rulesCoveredByOxlint 清单。
 *
 * 传入剔除 ignorePatterns 的扁平合并配置：
 * - ignorePatterns 若保留，会被桥接导出为 ESLint 全局 ignores，
 *   静默收窄 jsonc/yaml/docs 等场景的检查覆盖；
 * - categories 与规则取自根级对象，桥接据此推导关停集合。
 */
async function oxcCompat(): Promise<Linter.Config[]> {
  const { ignorePatterns: _ignorePatterns, ...config } = oxlintConfig;

  return oxlint.buildFromOxlintConfig(config);
}

export { oxcCompat };
