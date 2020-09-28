import type { Fn } from './types';

import { tryOnMounted, tryOnUnmounted } from '/@/utils/helper/vueHelper';
import { ref } from 'vue';

import { useDebounce } from '/@/hooks/core/useDebounce';

interface WindowSizeOptions {
  once?: boolean;
  immediate?: boolean;
  listenerOptions?: AddEventListenerOptions | boolean;
}

export function useWindowSizeFn<T>(fn: Fn<T>, wait = 150, options?: WindowSizeOptions): void {
  let handler = () => {
    fn();
  };
  const [handleSize, cancel] = useDebounce(handler, wait, options);
  handler = handleSize;

  tryOnMounted(() => {
    window.addEventListener('resize', handler);
  });
  tryOnUnmounted(() => {
    window.removeEventListener('resize', handler);
    cancel();
  });
}

export const useWindowSize = (wait = 150, options?: WindowSizeOptions) => {
  const widthRef = ref(0);
  const heightRef = ref(0);

  function setSize() {
    widthRef.value = window.innerWidth;
    heightRef.value = window.innerHeight;
  }
  setSize();

  const handler = () => {
    setSize();
  };

  useWindowSizeFn(handler, wait, options);

  return { widthRef: widthRef, heightRef: heightRef };
};
