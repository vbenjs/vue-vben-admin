import type { Linter } from 'eslint';

export async function turbo(): Promise<Linter.FlatConfig[]> {
  const [pluginTurbo] = await Promise.all([
    // @ts-expect-error - no types
    import('eslint-config-turbo'),
  ] as const);

  return [
    {
      plugins: {
        turbo: pluginTurbo,
      },
    },
  ];
}
