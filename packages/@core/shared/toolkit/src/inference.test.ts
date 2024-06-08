import { describe, expect, it } from 'vitest';

import {
  isEmpty,
  isHttpUrl,
  isObject,
  isUndefined,
  isWindow,
} from './inference';

describe('isHttpUrl', () => {
  it("should return true when given 'http://example.com'", () => {
    expect(isHttpUrl('http://example.com')).toBe(true);
  });

  it("should return true when given 'https://example.com'", () => {
    expect(isHttpUrl('https://example.com')).toBe(true);
  });

  it("should return false when given 'ftp://example.com'", () => {
    expect(isHttpUrl('ftp://example.com')).toBe(false);
  });

  it("should return false when given 'example.com'", () => {
    expect(isHttpUrl('example.com')).toBe(false);
  });
});

describe('isUndefined', () => {
  it('isUndefined should return true for undefined values', () => {
    expect(isUndefined()).toBe(true);
  });

  it('isUndefined should return false for null values', () => {
    expect(isUndefined(null)).toBe(false);
  });

  it('isUndefined should return false for defined values', () => {
    expect(isUndefined(0)).toBe(false);
    expect(isUndefined('')).toBe(false);
    expect(isUndefined(false)).toBe(false);
  });

  it('isUndefined should return false for objects and arrays', () => {
    expect(isUndefined({})).toBe(false);
    expect(isUndefined([])).toBe(false);
  });
});

describe('isEmpty', () => {
  it('should return true for empty string', () => {
    expect(isEmpty('')).toBe(true);
  });

  it('should return true for empty array', () => {
    expect(isEmpty([])).toBe(true);
  });

  it('should return true for empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('should return false for non-empty string', () => {
    expect(isEmpty('hello')).toBe(false);
  });

  it('should return false for non-empty array', () => {
    expect(isEmpty([1, 2, 3])).toBe(false);
  });

  it('should return false for non-empty object', () => {
    expect(isEmpty({ a: 1 })).toBe(false);
  });

  it('should return true for null or undefined', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty()).toBe(true);
  });

  it('should return false for number or boolean', () => {
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty(true)).toBe(false);
  });
});

describe('isWindow', () => {
  it('should return true for the window object', () => {
    expect(isWindow(window)).toBe(true);
  });

  it('should return false for other objects', () => {
    expect(isWindow({})).toBe(false);
    expect(isWindow([])).toBe(false);
    expect(isWindow(null)).toBe(false);
  });
});

describe('isObject', () => {
  it('should return true for objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
  });

  it('should return false for non-objects', () => {
    expect(isObject(null)).toBe(false);
    expect(isObject()).toBe(false);
    expect(isObject(42)).toBe(false);
    expect(isObject('string')).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject([1, 2, 3])).toBe(true);
    expect(isObject(new Date())).toBe(true);
    expect(isObject(/regex/)).toBe(true);
  });
});
