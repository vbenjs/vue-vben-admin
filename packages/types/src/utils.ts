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

export { type AnyFunction, type AnyPromiseFunction, type AnyNormalFunction };
