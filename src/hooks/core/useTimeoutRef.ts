import type { TimeoutResult } from './types';

import { ref } from 'vue';
import { tryOnUnmounted } from '/@/utils/helper/vueHelper';
export function useTimeoutRef(wait: number): TimeoutResult {
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

  tryOnUnmounted(clear);

  return [readyRef, clear, openTimer];
}
