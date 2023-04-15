// eslint-disable-next-line vue/prefer-import-from-vue
import { isArray, isFunction, isString } from '@vue/shared';
import { isBoolean, isNil, isNull, isNumber } from 'lodash-es';

const toString = Object.prototype.toString;

function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

function isObject(val: unknown): val is object {
  return val !== null && is(val, 'Object');
}

function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

function isEmpty<T = unknown>(value: T): value is T {
  if (value === null || value === undefined) {
    return true;
  }

  if (isArray(value) || isString(value)) {
    return value.length === 0;
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }

  return false;
}

/**
 * @description 判断所给字符串是否为url类型，这里只判断是否 http/http,其他格式不支持
 * @param pathname
 * @returns
 */
function isHttpUrl(url: string) {
  // Regular expression to match HTTP(S) URL
  const httpRegex = /^https?:\/\/.*$/;
  return httpRegex.test(url);
}

function isMap(val: unknown): val is Map<any, any> {
  return is(val, 'Map') || val instanceof Map;
}

function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && val !== null && val === val.window;
}

export {
  is,
  isArray,
  isBoolean,
  isEmpty,
  isFunction,
  isHttpUrl,
  isMap,
  isNil,
  isNull,
  isNumber,
  isObject,
  isString,
  isUndefined,
  isWindow,
};
