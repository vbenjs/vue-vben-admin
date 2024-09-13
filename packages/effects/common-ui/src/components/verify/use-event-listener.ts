import type { Ref } from 'vue';
import { ref, unref, watch } from 'vue';

import { useDebounceFn, useThrottleFn } from '@vueuse/core';

export type RemoveEventFn = () => void;
export interface UseEventParams {
  el?: any | Element | Ref<Element | undefined> | Window;
  name: string;
  listener: EventListener;
  options?: AddEventListenerOptions | boolean;
  autoRemove?: boolean;
  isDebounce?: boolean;
  wait?: number;
}
export function useEventListener({
  autoRemove = true,
  el = window,
  isDebounce = true,
  listener,
  name,
  options,
  wait = 80,
}: UseEventParams): { removeEvent: RemoveEventFn } {
  let remove: RemoveEventFn = () => {};
  const isAddRef = ref(false);

  if (el) {
    const element = ref(el as Element) as Ref<Element>;

    const handler = isDebounce
      ? useDebounceFn(listener, wait)
      : useThrottleFn(listener, wait);
    const realHandler = wait ? handler : listener;
    const removeEventListener = (e: Element) => {
      isAddRef.value = true;
      e.removeEventListener(name, realHandler, options);
    };
    const addEventListener = (e: Element) =>
      e.addEventListener(name, realHandler, options);

    const removeWatch = watch(
      element,
      (v, _ov, cleanUp) => {
        if (v) {
          !unref(isAddRef) && addEventListener(v);
          cleanUp(() => {
            autoRemove && removeEventListener(v);
          });
        }
      },
      { immediate: true },
    );

    remove = () => {
      removeEventListener(element.value);
      removeWatch();
    };
  }
  return { removeEvent: remove };
}
