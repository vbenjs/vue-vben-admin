import { describe, expectTypeOf, it } from 'vitest';

import type { DeepPartial } from '@vben-core/typings';

import { updateCustomPreferences } from '../src';

interface ProjectPreferences {
  defaultTableSize: number;
  tenantMode: 'multi' | 'single';
}

describe('custom preferences types', () => {
  it('accepts a typed partial update', () => {
    const updateProjectPreferences =
      updateCustomPreferences<ProjectPreferences>;

    expectTypeOf(updateProjectPreferences)
      .parameter(0)
      .toEqualTypeOf<DeepPartial<ProjectPreferences>>();
  });
});
