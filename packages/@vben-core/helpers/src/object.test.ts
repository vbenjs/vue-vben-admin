import { describe, expect, it } from 'vitest';

import { flattenObject, toCamelCase, toNestedObject } from './object';

describe('toCamelCase', () => {
  it('should return the key if parentKey is empty', () => {
    expect(toCamelCase('child', '')).toBe('child');
  });

  it('should combine parentKey and key in camel case', () => {
    expect(toCamelCase('child', 'parent')).toBe('parentChild');
  });

  it('should handle empty key and parentKey', () => {
    expect(toCamelCase('', '')).toBe('');
  });

  it('should handle key with capital letters', () => {
    expect(toCamelCase('Child', 'parent')).toBe('parentChild');
    expect(toCamelCase('Child', 'Parent')).toBe('ParentChild');
  });
});

describe('flattenObject', () => {
  it('should flatten a nested object correctly', () => {
    const nestedObject = {
      language: 'en',
      notifications: {
        email: true,
        push: {
          sound: true,
          vibration: false,
        },
      },
      theme: 'light',
    };

    const expected = {
      language: 'en',
      notificationsEmail: true,
      notificationsPushSound: true,
      notificationsPushVibration: false,
      theme: 'light',
    };

    const result = flattenObject(nestedObject);
    expect(result).toEqual(expected);
  });

  it('should handle empty objects', () => {
    const nestedObject = {};
    const expected = {};

    const result = flattenObject(nestedObject);
    expect(result).toEqual(expected);
  });

  it('should handle objects with primitive values', () => {
    const nestedObject = {
      active: true,
      age: 30,
      name: 'Alice',
    };

    const expected = {
      active: true,
      age: 30,
      name: 'Alice',
    };

    const result = flattenObject(nestedObject);
    expect(result).toEqual(expected);
  });

  it('should handle objects with null values', () => {
    const nestedObject = {
      user: {
        age: null,
        name: null,
      },
    };

    const expected = {
      userAge: null,
      userName: null,
    };

    const result = flattenObject(nestedObject);
    expect(result).toEqual(expected);
  });

  it('should handle nested empty objects', () => {
    const nestedObject = {
      a: {},
      b: { c: {} },
    };

    const expected = {};

    const result = flattenObject(nestedObject);
    expect(result).toEqual(expected);
  });

  it('should handle arrays within objects', () => {
    const nestedObject = {
      hobbies: ['reading', 'gaming'],
      name: 'Alice',
    };

    const expected = {
      hobbies: ['reading', 'gaming'],
      name: 'Alice',
    };

    const result = flattenObject(nestedObject);
    expect(result).toEqual(expected);
  });
  it('should flatten objects with nested arrays correctly', () => {
    const nestedObject = {
      person: {
        hobbies: ['reading', 'gaming'],
        name: 'Alice',
      },
    };

    const expected = {
      personHobbies: ['reading', 'gaming'],
      personName: 'Alice',
    };

    const result = flattenObject(nestedObject);
    expect(result).toEqual(expected);
  });

  it('should handle objects with undefined values', () => {
    const nestedObject = {
      user: {
        age: undefined,
        name: 'Alice',
      },
    };

    const expected = {
      userAge: undefined,
      userName: 'Alice',
    };

    const result = flattenObject(nestedObject);
    expect(result).toEqual(expected);
  });
});

describe('toNestedObject', () => {
  it('should convert flat object to nested object with level 1', () => {
    const flatObject = {
      anotherKeyExample: 2,
      commonAppName: 1,
      someOtherKey: 3,
    };

    const expectedNestedObject = {
      anotherKeyExample: 2,
      commonAppName: 1,
      someOtherKey: 3,
    };

    expect(toNestedObject(flatObject, 1)).toEqual(expectedNestedObject);
  });

  it('should convert flat object to nested object with level 2', () => {
    const flatObject = {
      appAnotherKeyExample: 2,
      appCommonName: 1,
      appSomeOtherKey: 3,
    };

    const expectedNestedObject = {
      app: {
        anotherKeyExample: 2,
        commonName: 1,
        someOtherKey: 3,
      },
    };

    expect(toNestedObject(flatObject, 2)).toEqual(expectedNestedObject);
  });

  it('should convert flat object to nested object with level 3', () => {
    const flatObject = {
      appAnotherKeyExampleValue: 2,
      appCommonNameKey: 1,
      appSomeOtherKeyItem: 3,
    };

    const expectedNestedObject = {
      app: {
        another: {
          keyExampleValue: 2,
        },
        common: {
          nameKey: 1,
        },
        some: {
          otherKeyItem: 3,
        },
      },
    };

    expect(toNestedObject(flatObject, 3)).toEqual(expectedNestedObject);
  });

  it('should handle empty object', () => {
    const flatObject = {};

    const expectedNestedObject = {};

    expect(toNestedObject(flatObject, 1)).toEqual(expectedNestedObject);
  });

  it('should handle single key object', () => {
    const flatObject = {
      singleKey: 1,
    };

    const expectedNestedObject = {
      singleKey: 1,
    };

    expect(toNestedObject(flatObject, 1)).toEqual(expectedNestedObject);
  });

  it('should handle complex keys', () => {
    const flatObject = {
      anotherComplexKeyWithParts: 2,
      complexKeyWithMultipleParts: 1,
    };

    const expectedNestedObject = {
      anotherComplexKeyWithParts: 2,
      complexKeyWithMultipleParts: 1,
    };

    expect(toNestedObject(flatObject, 1)).toEqual(expectedNestedObject);
  });
});
