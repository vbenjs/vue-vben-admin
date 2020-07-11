import { Ref, ref, watch, onUnmounted } from '@/setup/vue';
import { RefTyped } from '@/types';
export type RemoveEventFn = () => void;
export function useEvent({
  el,
  name,
  listener,
  options,
  autoRemove,
}: {
  el: Element | Ref<Element | undefined> | Window | RefTyped<any>;
  name: string;
  listener: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
  autoRemove?: boolean;
}): { removeEvent: RemoveEventFn } {
  /* eslint-disable-next-line */
  let remove: RemoveEventFn = () => {};

  if (el) {
    const element: Ref<Element> = ref(el as Element);

    const removeEventListener = (e: Element) => e.removeEventListener(name, listener);
    const addEventListener = (e: Element) => e.addEventListener(name, listener, options);

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
