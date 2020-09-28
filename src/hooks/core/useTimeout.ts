import type { TimeoutFnResult, Fn } from './types';

import { isFunction } from '/@/utils/is';
import { watch } from 'vue';

import { useTimeoutRef } from '/@/hooks/core/useTimeoutRef';

export function useTimeout(handle: Fn<any>, wait: number): TimeoutFnResult {
  if (!isFunction(handle)) {
    throw new Error('handle is not Function!');
  }

  const [readyRef, clear, runAgain] = useTimeoutRef(wait);

  watch(
    readyRef,
    (maturity) => {
      maturity && handle();
    },
    { immediate: false }
  );
  return [clear, runAgain, readyRef];
}
