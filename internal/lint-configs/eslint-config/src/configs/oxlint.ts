import type { Linter } from 'eslint';

import { mergeOxlintConfigs, oxlintConfig } from '@vben/oxlint-config';

import oxlint from 'eslint-plugin-oxlint';

export async function oxcCompat(): Promise<Linter.Config[]> {
  const { extends: _extends, ...config } = mergeOxlintConfigs(oxlintConfig);

  return oxlint.buildFromOxlintConfig(
    config as Parameters<typeof oxlint.buildFromOxlintConfig>[0],
  );
}
