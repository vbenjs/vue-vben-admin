import { Ref, ref, watch, unref } from 'compatible-vue';
import { RefTyped } from '@/types';
import { useDebounce } from '@/hooks/core/useDebounce';
import { useThrottle } from '@/hooks/core/useThrottle';

export type RemoveEventFn = () => void;

export interface UseEventParams {
  el: Element | Ref<Element | undefined> | Window | RefTyped<any>;
  name: string;
  listener: EventListener;
  options?: boolean | AddEventListenerOptions;
  autoRemove?: boolean;
  isDebounce?: boolean;
  wait?: number;
}
export function useEvent({
  el,
  name,
  listener,
  options,
  autoRemove = true,
  isDebounce = true,
  wait = 150,
}: UseEventParams): { removeEvent: RemoveEventFn } {
  /* eslint-disable-next-line */
  let remove: RemoveEventFn = () => {};
  const isAddRef = ref(false);

  if (el) {
    const element: Ref<Element> = ref(el as Element);

    const [handler] = isDebounce ? useDebounce(listener, wait) : useThrottle(listener, wait);
    const realHandler = wait ? handler : listener;
    const removeEventListener = (e: Element) => {
      isAddRef.value = true;
      e.removeEventListener(name, realHandler, options);
    };
    const addEventListener = (e: Element) => e.addEventListener(name, realHandler, options);

    const removeWatch = watch(
      element,
      (v, ov, cleanUp) => {
        if (v) {
          !unref(isAddRef) && addEventListener(v);
          cleanUp(() => {
            // @ts-ignore
            window.a = v;
            autoRemove && removeEventListener(v);
          });
        }
      },
      { immediate: true }
    );

    remove = () => {
      removeEventListener(element.value);
      removeWatch();
    };
  }
  return { removeEvent: remove };
}
