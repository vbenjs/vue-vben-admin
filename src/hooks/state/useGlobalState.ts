import { reactive } from 'vue';

export function createGlobalState<T extends object>(factory: () => T) {
  let state: T;

  return () => {
    if (!state) {
      state = reactive(factory()) as T;
    }
    return state;
  };
}
