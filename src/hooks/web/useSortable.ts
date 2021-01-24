import Sortable from 'sortablejs';
import { nextTick, unref } from 'vue';
import type { Ref } from 'vue';

export function useSortable(el: HTMLElement | Ref<HTMLElement>, options?: Sortable.Options) {
  function initSortable() {
    nextTick(() => {
      if (!el) return;
      Sortable.create(unref(el), {
        animation: 500,
        delay: 400,
        delayOnTouchOnly: true,
        ...options,
      });
    });
  }

  return { initSortable };
}
