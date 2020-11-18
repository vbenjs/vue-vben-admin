const toString = Object.prototype.toString;

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

export const isDef = <T = unknown>(val?: T): val is T => {
  return typeof val !== 'undefined';
};

export const isUnDef = <T = unknown>(val?: T): val is T => {
  return !isDef(val);
};

export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && is(val, 'Object');
};

export function isDate(val: unknown): val is Date {
  return is(val, 'Date');
}

export function isNull(val: unknown): val is null {
  return val === null;
}

export function isNumber(val: unknown): val is number {
  return is(val, 'Number');
}

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

export function isString(val: unknown): val is string {
  return is(val, 'String');
}

export const isFunction = (val: unknown): val is Function => typeof val === 'function';

export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean');
}

export function isRegExp(val: unknown): val is RegExp {
  return is(val, 'RegExp');
}

export function isArray(val: unknown): val is Array<any> {
  return val && Array.isArray(val);
}

export const isWindow = (val: any): val is Window => {
  return typeof window !== 'undefined' && is(val, 'Window');
};

export const isElement = (val: unknown): val is Element => {
  return isObject(val) && !!val.tagName;
};

export const isServer = typeof window === 'undefined';

export const isClient = typeof window !== 'undefined';

export function isImageDom(o: Element) {
  return o && ['IMAGE', 'IMG'].includes(o.tagName);
}

export const isTextarea = (element: Element | null): element is HTMLTextAreaElement => {
  return element !== null && element.tagName.toLowerCase() === 'textarea';
};
