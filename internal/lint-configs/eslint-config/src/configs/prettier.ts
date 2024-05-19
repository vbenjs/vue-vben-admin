import type { Linter } from 'eslint';

export async function prettier(): Promise<Linter.FlatConfig[]> {
  const [pluginPrettier] = await Promise.all([
    import('eslint-plugin-prettier'),
  ] as const);
  return [
    {
      plugins: {
        prettier: pluginPrettier,
      },
      rules: {
        'prettier/prettier': 'error',
      },
    },
  ];
}
