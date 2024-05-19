import { type ComputedRef, type MaybeRef } from 'vue';

/**
 * 深度部分类型
 */
type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * 任意类型的异步函数
 */

type AnyPromiseFunction<T extends any[] = any[], R = void> = (
  ...arg: T
) => PromiseLike<R>;

/**
 * 任意类型的普通函数
 */
type AnyNormalFunction<T extends any[] = any[], R = void> = (...arg: T) => R;

/**
 * 任意类型的函数
 */
type AnyFunction<T extends any[] = any[], R = void> =
  | AnyNormalFunction<T, R>
  | AnyPromiseFunction<T, R>;

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
interface ReadonlyRecordable<T = any> {
  readonly [key: string]: T;
}

/**
 * setTimeout 返回值类型
 */
type TimeoutHandle = ReturnType<typeof setTimeout>;

/**
 * setInterval 返回值类型
 */
type IntervalHandle = ReturnType<typeof setInterval>;

/**
 * 也许它是一个计算的 ref，或者一个 getter 函数
 *
 */
type MaybeReadonlyRef<T> = (() => T) | ComputedRef<T>;

/**
 * 也许它是一个 ref，或者一个普通值，或者一个 getter 函数
 *
 */
type MaybeComputedRef<T> = MaybeReadonlyRef<T> | MaybeRef<T>;

export {
  type AnyFunction,
  type AnyNormalFunction,
  type AnyPromiseFunction,
  type DeepPartial,
  type IntervalHandle,
  type MaybeComputedRef,
  type MaybeReadonlyRef,
  type NonNullable,
  type Nullable,
  type ReadonlyRecordable,
  type Recordable,
  type TimeoutHandle,
};
