import type { InjectionKey, ShallowUnwrapRef } from 'vue';
import { inject, provide, reactive, readonly } from 'vue';

interface CreateContextOptions {
  /**
   * @description 注入的变量是否
   * @default false
   */
  writeable?: boolean;
  /**
   * @description 数据是否需要具有反应性
   * @default true
   */
  reactiveable?: boolean;
}

function createContext<T>(
  key: InjectionKey<T> = Symbol(),
  context: any,
  options: CreateContextOptions = {},
) {
  const { writeable = false, reactiveable = true } = options;

  const reactiveContext = reactive(context);
  let provideData: T;
  if (!reactiveable) {
    provideData = context;
  } else {
    provideData = !writeable ? readonly(reactiveContext) : reactiveContext;
  }
  provide(key, provideData);
}

function useContext<T>(key: InjectionKey<T>, native?: boolean): T;
function useContext<T>(key: InjectionKey<T> = Symbol(), defaultValue?: any): ShallowUnwrapRef<T> {
  return inject(key, defaultValue || {});
}

export { createContext, type CreateContextOptions, useContext };
