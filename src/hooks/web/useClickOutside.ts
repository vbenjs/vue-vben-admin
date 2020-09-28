import { ref, Ref, unref } from 'vue';
import { useEvent } from '/@/hooks/event/useEvent';
export function useClickOutside<T extends HTMLElement>(
  containerRef: Ref<T>,
  onClickOutside: (e: MouseEvent | TouchEvent) => void
) {
  const isTouchRef = ref(false);
  useEvent({
    el: document,
    name: 'touchend',
    listener: handler,
    options: true,
  });
  useEvent({
    el: document,
    name: 'click',
    listener: handler,
    options: true,
  });

  function handler(e: MouseEvent | TouchEvent) {
    if (e.type === 'touchend') {
      isTouchRef.value = true;
    }
    if (e.type === 'click' && unref(isTouchRef)) return;

    const el = containerRef.value;
    if (el && e.target && !el.contains(e.target as Node)) {
      onClickOutside(e);
    }
  }
}
