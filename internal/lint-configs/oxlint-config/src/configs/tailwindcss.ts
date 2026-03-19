import type { OxlintConfig } from 'oxlint';

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

const settings = {
  entryPoint: 'internal/tailwind-config/src/theme.css',
  selectors,
};

const tailwindcss: OxlintConfig = {
  // Generated shadcn-ui internals are intentionally left unmanaged.
  ignorePatterns: ['packages/@core/ui-kit/shadcn-ui/**/*'],
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
  settings: {
    'better-tailwindcss': settings,
    'eslint-plugin-better-tailwindcss': settings,
  },
};

export { tailwindcss };
