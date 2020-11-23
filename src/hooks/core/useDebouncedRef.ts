import { customRef } from 'vue';

export function useDebouncedRef<T = any>(value: T, delay = 100) {
  let timeout: TimeoutHandle;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue: T) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
}
