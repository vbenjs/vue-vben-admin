/**
 * 任意类型的函数
 */
type AnyFunction = AnyNormalFunction | AnyPromiseFunction;

/**
 * 任意类型的异步函数
 */
type AnyPromiseFunction = (...arg: any) => PromiseLike<any>;

/**
 * 任意类型的普通函数
 */
type AnyNormalFunction = (...arg: any) => any;

/**
 *  T | null 包装
 */
type Nullable<T> = T | null;

/**
 * T | Not null 包装
 */
type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * 字符串类型对象
 */
type Recordable<T> = Record<string, T>;

/**
 * 字符串类型对象（只读）
 */
type ReadonlyRecordable<T = any> = {
  readonly [key: string]: T;
};

export {
  type AnyFunction,
  type AnyPromiseFunction,
  type AnyNormalFunction,
  type Nullable,
  type NonNullable,
  type Recordable,
  type ReadonlyRecordable,
};
