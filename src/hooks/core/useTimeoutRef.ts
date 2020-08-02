import { ref, onUnmounted, getCurrentInstance } from 'compatible-vue';
import { TimeoutResult } from './types';
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
