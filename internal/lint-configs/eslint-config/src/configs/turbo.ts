import type { Linter } from 'eslint';

import { interopDefault } from '../util';

export async function turbo(): Promise<Linter.Config[]> {
  const pluginTurbo = await interopDefault(import('eslint-config-turbo'));

  return [
    {
      plugins: {
        turbo: pluginTurbo,
      },
    },
  ];
}
