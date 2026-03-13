import type { Linter } from 'eslint';

import { mergeOxlintConfigs, oxlintConfig } from '@vben/oxlint-config';

import oxlint from 'eslint-plugin-oxlint';

export async function oxcCompat(): Promise<Linter.Config[]> {
  return oxlint.buildFromOxlintConfig(mergeOxlintConfigs(oxlintConfig));
}
