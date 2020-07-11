import { isFunction } from '@/utils/is/index';
import { ref, onUnmounted, getCurrentInstance, watch } from '@/setup/vue';
import { TimeoutResult, TimeoutFnResult, Fn } from './types';
export function useTimeoutRef(wait: number): TimeoutResult {
  const currentInstance = getCurrentInstance();
  const readyRef = ref(false);

  let timer: ReturnType<typeof setTimeout> | undefined;
  function clear(): void {
    readyRef.value = false;
    timer && window.clearTimeout(timer);
  }
  function openTimer(): void {
    clear();
    timer = setTimeout(() => {
      readyRef.value = true;
    }, wait);
  }

  openTimer();

  // 在组件内才进行调用
  if (currentInstance) {
    onUnmounted(clear);
  }

  return [readyRef, clear, openTimer];
}

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
