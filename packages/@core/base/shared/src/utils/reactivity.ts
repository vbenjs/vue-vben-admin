import { isProxy, isReactive, isRef, toRaw } from '@vue/reactivity';

function deepToRaw<T extends Record<string, any>>(sourceObj: T): T {
  const objectIterator = (input: any): any => {
    if (Array.isArray(input)) {
      return input.map((item) => objectIterator(item));
    }
    if (isRef(input) || isReactive(input) || isProxy(input)) {
      return objectIterator(toRaw(input));
    }
    if (input && typeof input === 'object') {
      const result = {} as T;
      for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
          result[key as keyof T] = objectIterator(input[key]);
        }
      }
      return result;
    }
    return input;
  };

  return objectIterator(sourceObj);
}

export { deepToRaw };
