import { describe, expect, it } from 'vitest';

import { nanoid } from '../nanoid';

describe('nanoid', () => {
  it('create uuid', () => {
    const _nanoid = nanoid();
    console.log('uuid:', _nanoid);
    expect(!!_nanoid).toBe(true);
  });
});
