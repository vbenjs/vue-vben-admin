import { ref, unref } from 'vue';

import type { UseRequestPlugin, UseRequestTimeout } from '../types';

const useLoadingDelayPlugin: UseRequestPlugin<any, any[]> = (
  fetchInstance,
  { loadingDelay, ready },
) => {
  const timerRef = ref<UseRequestTimeout>();

  if (!loadingDelay) {
    return {};
  }

  const cancelTimeout = () => {
    if (timerRef.value) {
      clearTimeout(timerRef.value);
    }
  };

  return {
    onBefore: () => {
      cancelTimeout();

      // Two cases:
      // 1. ready === undefined
      // 2. ready === true
      if (unref(ready) !== false) {
        timerRef.value = setTimeout(() => {
          fetchInstance.setState({ loading: true });
        }, loadingDelay);
      }

      return { loading: false };
    },
    onFinally: () => {
      cancelTimeout();
    },
    onCancel: () => {
      cancelTimeout();
    },
  };
};

export default useLoadingDelayPlugin;
