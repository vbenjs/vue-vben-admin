import { describe, expect, test } from 'vitest';

import { isEmpty, isUndefined, isHttpUrl, isMap, isWindow, isObject } from '../inference';

describe('isHttpUrl', () => {
  test("should return true when given 'http://example.com'", () => {
    expect(isHttpUrl('http://example.com')).toBe(true);
  });

  test("should return true when given 'https://example.com'", () => {
    expect(isHttpUrl('https://example.com')).toBe(true);
  });

  test("should return false when given 'ftp://example.com'", () => {
    expect(isHttpUrl('ftp://example.com')).toBe(false);
  });

  test("should return false when given 'example.com'", () => {
    expect(isHttpUrl('example.com')).toBe(false);
  });
});

describe('isUndefined', () => {
  test('isUndefined should return true for undefined values', () => {
    expect(isUndefined(undefined)).toBe(true);
  });

  test('isUndefined should return false for null values', () => {
    expect(isUndefined(null)).toBe(false);
  });

  test('isUndefined should return false for defined values', () => {
    expect(isUndefined(0)).toBe(false);
    expect(isUndefined('')).toBe(false);
    expect(isUndefined(false)).toBe(false);
  });

  test('isUndefined should return false for objects and arrays', () => {
    expect(isUndefined({})).toBe(false);
    expect(isUndefined([])).toBe(false);
  });
});

describe('isEmpty', () => {
  test('should return true for empty string', () => {
    expect(isEmpty('')).toBe(true);
  });

  test('should return true for empty array', () => {
    expect(isEmpty([])).toBe(true);
  });

  test('should return true for empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  test('should return false for non-empty string', () => {
    expect(isEmpty('hello')).toBe(false);
  });

  test('should return false for non-empty array', () => {
    expect(isEmpty([1, 2, 3])).toBe(false);
  });

  test('should return false for non-empty object', () => {
    expect(isEmpty({ a: 1 })).toBe(false);
  });

  test('should return true for null or undefined', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  test('should return false for number or boolean', () => {
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty(true)).toBe(false);
  });
});

describe('isMap', () => {
  test('should return true for Map objects', () => {
    expect(isMap(new Map())).toBe(true);
  });

  test('should return false for objects that are not a Map', () => {
    expect(isMap([])).toBe(false);
    expect(isMap({})).toBe(false);
    expect(isMap('')).toBe(false);
    expect(isMap(123)).toBe(false);
    expect(isMap(null)).toBe(false);
  });
});

describe('isWindow', () => {
  test('should return true for the window object', () => {
    expect(isWindow(window)).toBe(true);
  });

  test('should return false for other objects', () => {
    expect(isWindow({})).toBe(false);
    expect(isWindow([])).toBe(false);
    expect(isWindow(null)).toBe(false);
  });
});

describe('isObject', () => {
  test('should return true for objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
  });

  test('should return false for non-objects', () => {
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(42)).toBe(false);
    expect(isObject('string')).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject([1, 2, 3])).toBe(false);
    // TODO: isDate
    expect(isObject(new Date())).toBe(false);
    // TODO: isRegexp
    expect(isObject(/regex/)).toBe(false);
  });
});
