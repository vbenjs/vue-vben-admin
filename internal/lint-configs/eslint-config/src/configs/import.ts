import type { Linter } from 'eslint';

export async function importPluginConfig(): Promise<Linter.FlatConfig[]> {
  const [pluginImport] = await Promise.all([
    // @ts-expect-error - no types
    import('eslint-plugin-i'),
  ] as const);

  return [
    {
      plugins: {
        import: pluginImport,
      },
      rules: {
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        'import/no-self-import': 'error',
        'import/no-unresolved': 'off',
        'import/no-webpack-loader-syntax': 'error',
      },
    },
  ];
}
