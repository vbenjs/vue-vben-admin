import { type AnyFunction } from '@vben/types';
import { tryOnMounted, tryOnUnmounted, useDebounceFn } from '@vueuse/core';

interface UseWindowSizeOptions {
  /**
   * @description 节流时间
   * @default 150
   */
  wait?: number;
  /**
   * @description 立即执行
   * @default false
   */
  immediate?: boolean;
  /**
   * @description 只执行一次
   * @default false
   */
  once?: boolean;
}

function useWindowSizeFn(fn: AnyFunction, options: UseWindowSizeOptions = {}) {
  const { wait = 150, immediate } = options;

  let handler = () => {
    fn();
  };

  handler = useDebounceFn(handler, wait);

  const start = () => {
    if (immediate) {
      handler();
    }
    window.addEventListener('resize', handler);
  };

  const stop = () => {
    window.removeEventListener('resize', handler);
  };

  tryOnMounted(() => {
    start();
  });

  tryOnUnmounted(() => {
    stop();
  });
  return { start, stop };
}

export { useWindowSizeFn, type UseWindowSizeOptions };
