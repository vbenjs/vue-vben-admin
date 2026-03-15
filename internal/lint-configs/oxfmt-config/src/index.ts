import { defineConfig as defineOxfmtConfig } from 'oxfmt';

type OxfmtConfig = Parameters<typeof defineOxfmtConfig>[0];

const oxfmtConfig: OxfmtConfig = defineOxfmtConfig({
  printWidth: 80,
  proseWrap: 'never',
  semi: true,
  singleQuote: true,
  sortPackageJson: false,
  trailingComma: 'all',
  overrides: [
    {
      files: [
        '*.json',
        '*.json5',
        '*.jsonc',
        '*.code-workspace',
        '**/*.json',
        '**/*.json5',
        '**/*.jsonc',
        '**/*.code-workspace',
      ],
      options: {
        trailingComma: 'none',
      },
    },
  ],
});

function defineConfig(config: OxfmtConfig = {}): OxfmtConfig {
  return defineOxfmtConfig({
    ...oxfmtConfig,
    ...config,
  });
}

export { defineConfig, oxfmtConfig };
export type { OxfmtConfig };
