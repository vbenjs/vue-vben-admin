import { describe, expect, it } from 'vitest';

import { capitalizeFirstLetter, toLowerCaseFirstLetter } from './letter';

// 编写测试用例
describe('capitalizeFirstLetter', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
    expect(capitalizeFirstLetter('world')).toBe('World');
  });

  it('should handle empty strings', () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });

  it('should handle single character strings', () => {
    expect(capitalizeFirstLetter('a')).toBe('A');
    expect(capitalizeFirstLetter('b')).toBe('B');
  });

  it('should not change the case of other characters', () => {
    expect(capitalizeFirstLetter('hElLo')).toBe('HElLo');
  });
});

describe('toLowerCaseFirstLetter', () => {
  it('should convert the first letter to lowercase', () => {
    expect(toLowerCaseFirstLetter('CommonAppName')).toBe('commonAppName');
    expect(toLowerCaseFirstLetter('AnotherKeyExample')).toBe(
      'anotherKeyExample',
    );
  });

  it('should return the same string if the first letter is already lowercase', () => {
    expect(toLowerCaseFirstLetter('alreadyLowerCase')).toBe('alreadyLowerCase');
  });

  it('should handle empty strings', () => {
    expect(toLowerCaseFirstLetter('')).toBe('');
  });

  it('should handle single character strings', () => {
    expect(toLowerCaseFirstLetter('A')).toBe('a');
    expect(toLowerCaseFirstLetter('a')).toBe('a');
  });

  it('should handle strings with only one uppercase letter', () => {
    expect(toLowerCaseFirstLetter('A')).toBe('a');
  });

  it('should handle strings with special characters', () => {
    expect(toLowerCaseFirstLetter('!Special')).toBe('!Special');
    expect(toLowerCaseFirstLetter('123Number')).toBe('123Number');
  });
});
