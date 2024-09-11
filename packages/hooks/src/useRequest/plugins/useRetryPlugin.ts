import { ref } from 'vue';

import type { UseRequestPlugin, UseRequestTimeout } from '../types';

const useRetryPlugin: UseRequestPlugin<any, any[]> = (
  fetchInstance,
  { retryInterval, retryCount },
) => {
  const timerRef = ref<UseRequestTimeout>();
  const countRef = ref(0);

  const triggerByRetry = ref(false);

  if (!retryCount) {
    return {};
  }

  return {
    onBefore: () => {
      if (!triggerByRetry.value) {
        countRef.value = 0;
      }
      triggerByRetry.value = false;

      if (timerRef.value) {
        clearTimeout(timerRef.value);
      }
    },
    onSuccess: () => {
      countRef.value = 0;
    },
    onError: () => {
      countRef.value += 1;
      if (retryCount === -1 || countRef.value <= retryCount) {
        // Exponential backoff
        const timeout = retryInterval ?? Math.min(1000 * 2 ** countRef.value, 30000);
        timerRef.value = setTimeout(() => {
          triggerByRetry.value = true;
          fetchInstance.refresh();
        }, timeout);
      } else {
        countRef.value = 0;
      }
    },
    onCancel: () => {
      countRef.value = 0;
      if (timerRef.value) {
        clearTimeout(timerRef.value);
      }
    },
  };
};

export default useRetryPlugin;
