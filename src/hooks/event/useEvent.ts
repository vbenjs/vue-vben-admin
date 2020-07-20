import { Ref, ref, onMounted, onUnmounted, unref } from 'compatible-vue';
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
}: UseEventParams) {
  if (el) {
    const elementRef: Ref<Element> = ref(el as Element);
    const element = unref(elementRef);
    const [handler] = isDebounce ? useDebounce(listener, wait) : useThrottle(listener, wait);

    onMounted(() => {
      element.addEventListener(name, handler, options);
    });
    autoRemove &&
      onUnmounted(() => {
        element.removeEventListener(name, handler, options);
      });
  }
}
