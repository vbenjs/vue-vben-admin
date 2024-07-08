import type { Linter } from 'eslint';

export async function perfectionist(): Promise<Linter.FlatConfig[]> {
  const [perfectionistNatural] = await Promise.all([
    // @ts-expect-error - no types
    import('eslint-plugin-perfectionist/configs/recommended-natural'),
  ] as const);

  return [
    perfectionistNatural,
    {
      rules: {
        'perfectionist/sort-exports': [
          'error',
          {
            order: 'asc',
            type: 'natural',
          },
        ],
        'perfectionist/sort-imports': [
          'error',
          {
            'custom-groups': {
              type: {
                vben: 'vben',
                vue: 'vue',
              },
              value: {
                vben: ['@vben*', '@vben/**/**', '@vben-core/**/**'],
                vue: ['vue', 'vue-*', '@vue*'],
              },
            },
            groups: [
              ['external-type', 'builtin-type', 'type'],
              ['parent-type', 'sibling-type', 'index-type'],
              ['internal-type'],
              'builtin',
              'vue',
              'vben',
              'external',
              'internal',
              ['parent', 'sibling', 'index'],
              'side-effect',
              'side-effect-style',
              'style',
              'object',
              'unknown',
            ],
            'internal-pattern': ['#*', '#*/**'],
            'newlines-between': 'always',
            order: 'asc',
            type: 'natural',
          },
        ],
        'perfectionist/sort-named-exports': [
          'error',
          {
            order: 'asc',
            type: 'natural',
          },
        ],
        'perfectionist/sort-objects': [
          'error',
          {
            'custom-groups': {
              items: 'items',
              list: 'list',
              children: 'children',
            },
            groups: ['unknown', 'items', 'list', 'children'],
            'ignore-pattern': ['children'],
            order: 'asc',
            'partition-by-comment': 'Part:**',
            type: 'natural',
          },
        ],
        'perfectionist/sort-vue-attributes': [
          'error',
          {
            // Based on: https://vuejs.org/style-guide/rules-recommended.html#element-attribute-order
            'custom-groups': {
              /* eslint-disable perfectionist/sort-objects */
              DEFINITION: '*(is|:is|v-is)',
              LIST_RENDERING: 'v-for',
              CONDITIONALS: 'v-*(else-if|if|else|show|cloak)',
              RENDER_MODIFIERS: 'v-*(pre|once)',
              GLOBAL: '*(:id|id)',
              UNIQUE: '*(ref|key|:ref|:key)',
              SLOT: '*(v-slot|slot)',
              TWO_WAY_BINDING: '*(v-model|v-model:*)',
              // OTHER_DIRECTIVES e.g. 'v-custom-directive'
              EVENTS: '*(v-on|@*)',
              CONTENT: 'v-*(html|text)',
              /* eslint-enable perfectionist/sort-objects */
            },
            groups: [
              'DEFINITION',
              'LIST_RENDERING',
              'CONDITIONALS',
              'RENDER_MODIFIERS',
              'GLOBAL',
              'UNIQUE',
              'SLOT',
              'TWO_WAY_BINDING',
              'unknown',
              'EVENTS',
              'CONTENT',
            ],
            type: 'natural',
          },
        ],
      },
    },
  ];
}
