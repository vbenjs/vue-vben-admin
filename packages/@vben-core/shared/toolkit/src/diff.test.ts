import { describe, expect, it } from 'vitest';

import { diff } from './diff';

describe('diff function', () => {
  it('should correctly find differences in flat objects', () => {
    const oldObj = { a: 1, b: 2, c: 3 };
    const newObj = { a: 1, b: 3, c: 3 };
    expect(diff(oldObj, newObj)).toEqual({ b: 3 });
  });

  it('should correctly handle nested objects', () => {
    const oldObj = { a: { b: 1, c: 2 }, d: 3 };
    const newObj = { a: { b: 1, c: 3 }, d: 3 };
    expect(diff(oldObj, newObj)).toEqual({ a: { b: 1, c: 3 } });
  });

  it('should correctly handle arrays`', () => {
    const oldObj = { a: [1, 2, 3] };
    const newObj = { a: [1, 2, 4] };
    expect(diff(oldObj, newObj)).toEqual({ a: [1, 2, 4] });
  });

  it('should correctly handle nested arrays', () => {
    const oldObj = {
      a: [
        [1, 2],
        [3, 4],
      ],
    };
    const newObj = {
      a: [
        [1, 2],
        [3, 5],
      ],
    };
    expect(diff(oldObj, newObj)).toEqual({
      a: [
        [1, 2],
        [3, 5],
      ],
    });
  });

  it('should return null if objects are identical', () => {
    const oldObj = { a: 1, b: 2, c: 3 };
    const newObj = { a: 1, b: 2, c: 3 };
    expect(diff(oldObj, newObj)).toBeNull();
  });

  it('should return differences between two objects excluding ignored fields', () => {
    const oldObj = { a: 1, b: 2, c: 3, d: 6 };
    const newObj = { a: 2, b: 2, c: 4, d: 5 };
    const ignoreFields: (keyof typeof newObj)[] = ['a', 'd'];

    const result = diff(oldObj, newObj, ignoreFields);

    expect(result).toEqual({ c: 4 });
  });
});
