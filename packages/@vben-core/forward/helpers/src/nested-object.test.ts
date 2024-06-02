import { describe, expect, it } from 'vitest';

import { nestedObject } from './nested-object';

describe('nestedObject', () => {
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

    expect(nestedObject(flatObject, 1)).toEqual(expectedNestedObject);
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

    expect(nestedObject(flatObject, 2)).toEqual(expectedNestedObject);
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

    expect(nestedObject(flatObject, 3)).toEqual(expectedNestedObject);
  });

  it('should handle empty object', () => {
    const flatObject = {};

    const expectedNestedObject = {};

    expect(nestedObject(flatObject, 1)).toEqual(expectedNestedObject);
  });

  it('should handle single key object', () => {
    const flatObject = {
      singleKey: 1,
    };

    const expectedNestedObject = {
      singleKey: 1,
    };

    expect(nestedObject(flatObject, 1)).toEqual(expectedNestedObject);
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

    expect(nestedObject(flatObject, 1)).toEqual(expectedNestedObject);
  });

  it('should correctly nest an object based on the specified level', () => {
    const obj = {
      oneFiveSix: 'Value156',
      oneTwoFour: 'Value124',
      oneTwoThree: 'Value123',
    };

    const nested = nestedObject(obj, 2);

    expect(nested).toEqual({
      one: {
        fiveSix: 'Value156',
        twoFour: 'Value124',
        twoThree: 'Value123',
      },
    });
  });
});
