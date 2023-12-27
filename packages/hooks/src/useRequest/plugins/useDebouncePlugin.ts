import type { DebouncedFunc, DebounceSettings } from 'lodash-es';
import { debounce } from 'lodash-es';
import { computed, ref, watchEffect } from 'vue';

import type { UseRequestPlugin } from '../types';

const useDebouncePlugin: UseRequestPlugin<any, any[]> = (
  fetchInstance,
  { debounceWait, debounceLeading, debounceTrailing, debounceMaxWait },
) => {
  const debouncedRef = ref<DebouncedFunc<any>>();

  const options = computed(() => {
    const ret: DebounceSettings = {};

    if (debounceLeading !== undefined) {
      ret.leading = debounceLeading;
    }
    if (debounceTrailing !== undefined) {
      ret.trailing = debounceTrailing;
    }
    if (debounceMaxWait !== undefined) {
      ret.maxWait = debounceMaxWait;
    }

    return ret;
  });

  watchEffect(() => {
    if (debounceWait) {
      const _originRunAsync = fetchInstance.runAsync.bind(fetchInstance);

      debouncedRef.value = debounce(
        (callback) => {
          callback();
        },
        debounceWait,
        options.value,
      );

      // debounce runAsync should be promise
      // https://github.com/lodash/lodash/issues/4400#issuecomment-834800398
      fetchInstance.runAsync = (...args) => {
        return new Promise((resolve, reject) => {
          debouncedRef.value?.(() => {
            _originRunAsync(...args)
              .then(resolve)
              .catch(reject);
          });
        });
      };

      return () => {
        debouncedRef.value?.cancel();
        fetchInstance.runAsync = _originRunAsync;
      };
    }
  });

  if (!debounceWait) {
    return {};
  }

  return {
    onCancel: () => {
      debouncedRef.value?.cancel();
    },
  };
};

export default useDebouncePlugin;
