import { nextTick, unref } from 'vue';
import type { Ref } from 'vue';
import type { Options } from 'sortablejs';

export function useSortable(el?: HTMLElement | Ref<HTMLElement | undefined>, options?: Options) {
  function initSortable() {
    nextTick(async () => {
      el = unref(el);

      if (!el) return;

      const Sortable = (await import('sortablejs')).default;
      Sortable.create(el, {
        animation: 100,
        delay: 400,
        delayOnTouchOnly: true,
        ...options,
      });
    });
  }

  return { initSortable };
}
