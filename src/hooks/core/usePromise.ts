import { reactive, computed, Ref } from 'compatible-vue';

import { PromiseFn, PromiseState } from './types';

/**
 * @description: 尝试获取错误
 */
export function usePromise<T>(fn: PromiseFn<T>, opt?: { immediate?: boolean }) {
  const { immediate = false } = opt!;
  if (!fn) {
    throw new Error('[usePromise]: 1st argument is required (must be a function)');
  }

  if (typeof fn !== 'function') {
    throw new Error(`[usePromise]: argument has to be function, but received ${typeof fn}`);
  }
  const state = reactive<PromiseState>({
    loading: false,
    error: null,
    result: null,
    done: false,
  });
  let lastPromise: Promise<T>;
  const exec = async (...args) => {
    state.error = null;
    state.loading = true;
    const promise = (lastPromise = fn(...args));
    try {
      const result = await promise;
      if (lastPromise === promise) {
        state.result = result;
      }
    } catch (e) {
      state.error = e;
    } finally {
      state.loading = false;
      state.done = true;
    }
  };
  immediate && exec();
  return {
    resultRef: computed(() => state.result) as Readonly<Ref<T>>,
    doneRef: computed(() => state.done),
    loadingRef: computed(() => state.loading),
    errorRef: computed(() => state.error),
    exec,
  };
}
