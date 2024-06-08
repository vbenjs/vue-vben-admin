import { describe, expect, it } from 'vitest';

import { generateUUID } from './hash';

describe('generateUUID', () => {
  it('should return a string', () => {
    const uuid = generateUUID();
    expect(typeof uuid).toBe('string');
  });

  it('should be length 32', () => {
    const uuid = generateUUID();
    expect(uuid.length).toBe(36);
  });

  it('should have the correct format', () => {
    const uuid = generateUUID();
    const uuidRegex =
      /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;
    expect(uuidRegex.test(uuid)).toBe(true);
  });
});
