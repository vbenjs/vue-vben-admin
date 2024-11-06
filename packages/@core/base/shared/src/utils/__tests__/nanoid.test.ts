import { describe, expect, it } from 'vitest';

import { nanoid } from '../nanoid';

describe('nanoid', () => {
  it('create uuid', () => {
    const _nanoid = nanoid();
    // console.log('uuid:', _nanoid);
    // expect(!!_nanoid).toBe(true);
    expect(typeof _nanoid).toBe('string');
    expect(_nanoid.length).toBeGreaterThan(0);
  });
  it('should generate unique ids', () => {
    const ids = new Set();
    for (let i = 0; i < 1000; i++) {
      const id = nanoid();
      expect(ids.has(id)).toBe(false);
      ids.add(id);
    }
  });
});
