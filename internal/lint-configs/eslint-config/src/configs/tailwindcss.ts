import type { Linter } from 'eslint';

import { getDefaultSelectors } from 'eslint-plugin-better-tailwindcss/defaults';
import { SelectorKind } from 'eslint-plugin-better-tailwindcss/types';

import { interopDefault } from '../util';

export async function tailwindcss(): Promise<Linter.Config[]> {
  const [pluginBetterTailwindcss] = await Promise.all([
    interopDefault(import('eslint-plugin-better-tailwindcss')),
  ] as const);

  return [
    {
      plugins: {
        'better-tailwindcss': pluginBetterTailwindcss,
      },
      // shadcn-ui 内部组件是自动生成的，不做太多限制
      ignores: ['packages/@core/ui-kit/shadcn-ui/**/**'],
      settings: {
        'better-tailwindcss': {
          entryPoint: 'packages/@core/base/design/src/css/global.css',
          selectors: [
            ...getDefaultSelectors(), // preserve default selectors
            {
              kind: SelectorKind.Attribute,
              match: [{ type: 'objectValues' }],
              name: '^classNames$',
            },
          ],
        },
      },
      rules: {
        ...pluginBetterTailwindcss.configs.recommended.rules,
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
    },
  ];
}
