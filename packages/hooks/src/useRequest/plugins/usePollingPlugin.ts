import { ref, watch } from 'vue';

import type { UseRequestPlugin, UseRequestTimeout } from '../types';
import { isDocumentVisible } from '../utils/isDocumentVisible';
import subscribeReVisible from '../utils/subscribeReVisible';

const usePollingPlugin: UseRequestPlugin<any, any[]> = (
  fetchInstance,
  { pollingInterval, pollingWhenHidden = true, pollingErrorRetryCount = -1 },
) => {
  const timerRef = ref<UseRequestTimeout>();
  const unsubscribeRef = ref<() => void>();
  const countRef = ref<number>(0);

  const stopPolling = () => {
    if (timerRef.value) {
      clearTimeout(timerRef.value);
    }
    unsubscribeRef.value?.();
  };

  watch(
    () => pollingInterval,
    () => {
      if (!pollingInterval) {
        stopPolling();
      }
    },
  );

  if (!pollingInterval) {
    return {};
  }

  return {
    onBefore: () => {
      stopPolling();
    },
    onError: () => {
      countRef.value += 1;
    },
    onSuccess: () => {
      countRef.value = 0;
    },
    onFinally: () => {
      if (
        pollingErrorRetryCount === -1 ||
        // When an error occurs, the request is not repeated after pollingErrorRetryCount retries
        (pollingErrorRetryCount !== -1 && countRef.value <= pollingErrorRetryCount)
      ) {
        timerRef.value = setTimeout(() => {
          // if pollingWhenHidden = false && document is hidden, then stop polling and subscribe revisible
          if (!pollingWhenHidden && !isDocumentVisible()) {
            unsubscribeRef.value = subscribeReVisible(() => {
              fetchInstance.refresh();
            });
          } else {
            fetchInstance.refresh();
          }
        }, pollingInterval);
      } else {
        countRef.value = 0;
      }
    },
    onCancel: () => {
      stopPolling();
    },
  };
};

export default usePollingPlugin;
