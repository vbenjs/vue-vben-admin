// 暂时未安装依赖，无法测试
// @ts-ignore
import { describe, expect, test } from 'vitest';
import { deepMerge } from '@/utils';

describe('deepMerge function', () => {
  test('should merge two objects recursively', () => {
    const source = {
      a: { b: { c: 1 }, d: [1, 2] },
      e: [1, 2],
      foo: { bar: 3 },
      array: [
        {
          does: 'work',
          too: [1, 2, 3],
        },
      ],
    };
    const target = {
      a: { b: { d: [3] } },
      e: [3],
      foo: { baz: 4 },
      qu: 5,
      array: [
        {
          does: 'work',
          too: [4, 5, 6],
        },
        {
          really: 'yes',
        },
      ],
    };
    const expected = {
      a: { b: { c: 1, d: [3] }, d: [1, 2] },
      e: [3],
      foo: {
        bar: 3,
        baz: 4,
      },
      array: [
        {
          does: 'work',
          too: [4, 5, 6],
        },
        {
          really: 'yes',
        },
      ],
      qu: 5,
    };
    expect(deepMerge(source, target)).toEqual(expected);
  });

  test('should replace arrays by default', () => {
    const source = {
      a: { b: { d: [1, 2] } },
      e: [1, 2],
    };
    const target = {
      a: { b: { d: [3] } },
      e: [3],
    };
    const expected = {
      a: { b: { d: [3] } },
      e: [3],
    };
    expect(deepMerge(source, target)).toEqual(expected);
  });

  test("should union arrays using mergeArrays = 'union'", () => {
    const source = {
      a: { b: { d: [1, 2] } },
      e: [1, 2],
    };
    const target = {
      a: { b: { d: [2, 3] } },
      e: [3],
    };
    const expected = {
      a: { b: { d: [1, 2, 3] } },
      e: [1, 2, 3],
    };
    expect(deepMerge(source, target, 'union')).toEqual(expected);
  });

  test("should intersect arrays using mergeArrays = 'intersection'", () => {
    const source = {
      a: { b: { d: [1, 2] } },
      e: [1, 2],
    };
    const target = {
      a: { b: { d: [2, 3] } },
      e: [3],
    };
    const expected = {
      a: { b: { d: [2] } },
      e: [],
    };
    expect(deepMerge(source, target, 'intersection')).toEqual(expected);
  });

  test("should concatenate arrays using mergeArrays = 'concat'", () => {
    const source = {
      a: { b: { d: [1, 2] } },
      e: [1, 2],
    };
    const target = {
      a: { b: { d: [2, 3] } },
      e: [3],
    };
    const expected = {
      a: { b: { d: [1, 2, 2, 3] } },
      e: [1, 2, 3],
    };
    expect(deepMerge(source, target, 'concat')).toEqual(expected);
  });
});
