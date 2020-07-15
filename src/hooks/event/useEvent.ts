import { Ref, ref, watch, onUnmounted } from 'compatible-vue';
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
  autoRemove,
  isDebounce = true,
  wait = 150,
}: UseEventParams): { removeEvent: RemoveEventFn } {
  /* eslint-disable-next-line */
  let remove: RemoveEventFn = () => {};

  if (el) {
    const element: Ref<Element> = ref(el as Element);

    const [handler] = isDebounce ? useDebounce(listener, wait) : useThrottle(listener, wait);

    const removeEventListener = (e: Element) => e.removeEventListener(name, handler);
    const addEventListener = (e: Element) => e.addEventListener(name, handler, options);

    const removeWatch = watch(
      element,
      (v, ov, cleanUp) => {
        if (v) {
          addEventListener(v);
          cleanUp(() => removeEventListener(v));
        }
      },
      { immediate: true }
    );

    remove = () => {
      removeEventListener(element.value);
      removeWatch();
    };
  }
  autoRemove &&
    onUnmounted(() => {
      remove();
    });
  return { removeEvent: remove };
}
