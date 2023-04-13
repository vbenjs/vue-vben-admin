import { describe, expect, test } from 'vitest';

import { generateUUID } from '../hash';

describe('generateUUID', () => {
  test('generates valid UUID', () => {
    const uuid = generateUUID();
    expect(uuid.length).toBe(38);
  });

  test('generates unique UUIDs', () => {
    const uuidSet = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      const uuid = generateUUID();
      expect(uuidSet).not.toContain(uuid);
      uuidSet.add(uuid);
    }
  });
});
