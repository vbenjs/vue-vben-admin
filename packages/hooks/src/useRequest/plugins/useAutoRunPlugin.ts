import { ref, unref, watch } from 'vue';

import type { UseRequestPlugin } from '../types';

// support refreshDeps & ready
const useAutoRunPlugin: UseRequestPlugin<any, any[]> = (
  fetchInstance,
  { manual, ready = true, defaultParams = [], refreshDeps = [], refreshDepsAction },
) => {
  const hasAutoRun = ref(false);

  watch(
    () => unref(ready),
    (readyVal) => {
      if (!unref(manual) && readyVal) {
        hasAutoRun.value = true;
        fetchInstance.run(...defaultParams);
      }
    },
  );

  if (refreshDeps.length) {
    watch(refreshDeps, () => {
      if (hasAutoRun.value) {
        return;
      }
      if (!manual) {
        if (refreshDepsAction) {
          refreshDepsAction();
        } else {
          fetchInstance.refresh();
        }
      }
    });
  }

  return {
    onBefore: () => {
      if (!unref(ready)) {
        return { stopNow: true };
      }
    },
  };
};

useAutoRunPlugin.onInit = ({ ready = true, manual }) => {
  return {
    loading: !unref(manual) && unref(ready),
  };
};

export default useAutoRunPlugin;
