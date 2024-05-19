import type { Linter } from 'eslint';

export async function regexp(): Promise<Linter.FlatConfig[]> {
  const [pluginRegexp] = await Promise.all([
    import('eslint-plugin-regexp'),
  ] as const);

  return [
    {
      plugins: {
        regexp: pluginRegexp,
      },
      rules: {
        ...pluginRegexp.configs.recommended.rules,
      },
    },
  ];
}
