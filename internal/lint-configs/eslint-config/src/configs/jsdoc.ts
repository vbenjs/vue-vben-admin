import type { Linter } from 'eslint';

export async function jsdoc(): Promise<Linter.FlatConfig[]> {
  const [pluginJsdoc] = await Promise.all([
    import('eslint-plugin-jsdoc'),
  ] as const);

  return [
    {
      plugins: {
        // @ts-expect-error - no types
        jsdoc: pluginJsdoc,
      },
      rules: {
        'jsdoc/check-access': 'warn',
        'jsdoc/check-param-names': 'warn',
        'jsdoc/check-property-names': 'warn',
        'jsdoc/check-types': 'warn',
        'jsdoc/empty-tags': 'warn',
        'jsdoc/implements-on-classes': 'warn',
        'jsdoc/no-defaults': 'warn',
        'jsdoc/no-multi-asterisks': 'warn',
        'jsdoc/require-param-name': 'warn',
        'jsdoc/require-property': 'warn',
        'jsdoc/require-property-description': 'warn',
        'jsdoc/require-property-name': 'warn',
        'jsdoc/require-returns-check': 'warn',
        'jsdoc/require-returns-description': 'warn',
        'jsdoc/require-yields-check': 'warn',
      },
    },
  ];
}
