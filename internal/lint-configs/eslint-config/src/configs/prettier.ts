import type { Linter } from 'eslint';

import { interopDefault } from '../util';

export async function prettier(): Promise<Linter.Config[]> {
  const pluginPrettier = await interopDefault(import('eslint-plugin-prettier'));
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
