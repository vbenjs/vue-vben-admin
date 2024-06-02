import { describe, expect, it } from 'vitest';

import { flattenObject } from './flatten-object';

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
