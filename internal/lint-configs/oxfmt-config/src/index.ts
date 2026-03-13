import { defineConfig as defineOxfmtConfig } from 'oxfmt';

type OxfmtConfig = Parameters<typeof defineOxfmtConfig>[0];

const oxfmtConfig = defineOxfmtConfig({
  printWidth: 80,
  proseWrap: 'never',
  semi: true,
  singleQuote: true,
  sortPackageJson: false,
  trailingComma: 'all',
});

function defineConfig(config: OxfmtConfig = {}) {
  return defineOxfmtConfig({
    ...oxfmtConfig,
    ...config,
  });
}

export { defineConfig, oxfmtConfig };
export type { OxfmtConfig };
