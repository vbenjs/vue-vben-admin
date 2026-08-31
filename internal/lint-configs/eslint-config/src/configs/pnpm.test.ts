import { describe, expect, it } from 'vitest';

import { pnpm } from './pnpm';

describe('pnpm eslint config', () => {
  it('reports invalid catalog entries without applying autofixes', async () => {
    const [packageJsonConfig] = await pnpm();

    expect(packageJsonConfig?.rules?.['pnpm/json-valid-catalog']).toEqual([
      'error',
      { autofix: false },
    ]);
  });
});
