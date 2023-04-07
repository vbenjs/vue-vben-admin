import { isArray, isFunction, isObject, isString } from '@vue/shared';
import { isBoolean, isNumber } from '@vueuse/core';

const toString = Object.prototype.toString;

function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

function isUndefined(val: unknown): val is undefined {
  return val === undefined;
}

function isNull(val: unknown): val is null {
  return val === null;
}

function isNullOrUndefined(val: unknown): val is undefined | null {
  return isUndefined(val) || isNull(val);
}

function isEmpty<T = unknown>(val: T): val is T {
  if (!val && val !== 0) {
    return true;
  }

  if (isArray(val) || isString(val)) {
    return val.length === 0;
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0;
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0;
  }

  return false;
}

/**
 * 判断所给字符串是否为url类型，这里只判断是否 http/http,其他格式不支持
 * @param pathname
 * @returns
 */
function isHttpUrl(pathname: string): boolean {
  const reg = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/;
  return reg.test(pathname);
}

function isMap(val: unknown): val is Map<any, any> {
  return is(val, 'Map');
}

function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window');
}

export {
  is,
  isArray,
  isBoolean,
  isEmpty,
  isFunction,
  isHttpUrl,
  isMap,
  isNull,
  isNullOrUndefined,
  isNumber,
  isObject,
  isString,
  isUndefined,
  isWindow,
};
