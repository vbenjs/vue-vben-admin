import { tryOnMounted, tryOnUnmounted } from '/@/utils/helper/vueHelper';

import { useDebounce } from '/@/hooks/core/useDebounce';

interface WindowSizeOptions {
  once?: boolean;
  immediate?: boolean;
  listenerOptions?: AddEventListenerOptions | boolean;
}

export function useWindowSizeFn<T>(fn: Fn<T>, wait = 150, options?: WindowSizeOptions) {
  let handler = () => {
    fn();
  };
  const [handleSize, cancel] = useDebounce(handler, wait, options);
  handler = handleSize;

  const start = () => {
    if (options && options.immediate) {
      handler();
    }
    window.addEventListener('resize', handler);
  };

  const stop = () => {
    window.removeEventListener('resize', handler);
    cancel();
  };

  tryOnMounted(() => {
    start();
  });

  tryOnUnmounted(() => {
    stop();
  });
  return [start, stop];
}
