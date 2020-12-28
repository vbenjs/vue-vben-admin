import type { BasicTableProps } from '../types/table';
import type { Ref, ComputedRef } from 'vue';
import { computed, unref, ref, nextTick, watchEffect } from 'vue';

import { getViewportOffset } from '/@/utils/domUtils';
import { isBoolean } from '/@/utils/is';

import { useWindowSizeFn } from '/@/hooks/event/useWindowSizeFn';
import { useModalContext } from '/@/components/Modal';

export function useTableScroll(
  propsRef: ComputedRef<BasicTableProps>,
  tableElRef: Ref<ComponentRef>
) {
  const tableHeightRef: Ref<Nullable<number>> = ref(null);

  const modalFn = useModalContext();

  const getCanResize = computed(() => {
    const { canResize, scroll } = unref(propsRef);
    return canResize && !(scroll || {}).y;
  });

  watchEffect(() => {
    redoHeight();
  });

  function redoHeight() {
    if (unref(getCanResize)) {
      nextTick(() => {
        calcTableHeight();
      });
    }
  }

  // No need to repeat queries
  let paginationEl: HTMLElement | null;
  let footerEl: HTMLElement | null;

  async function calcTableHeight() {
    const { resizeHeightOffset, pagination, maxHeight } = unref(propsRef);
    if (!unref(getCanResize)) return;

    await nextTick();
    const table = unref(tableElRef);
    if (!table) return;

    const tableEl: Element = table.$el;
    if (!tableEl) return;

    const headEl = tableEl.querySelector('.ant-table-thead ');
    if (!headEl) return;

    // Table height from bottom
    const { bottomIncludeBody } = getViewportOffset(headEl);
    // Table height from bottom height-custom offset

    const paddingHeight = 32;
    const borderHeight = 2 * 2;
    // Pager height
    let paginationHeight = 2;
    if (!isBoolean(pagination)) {
      if (!paginationEl) {
        paginationEl = tableEl.querySelector('.ant-pagination') as HTMLElement;
      }
      if (paginationEl) {
        const offsetHeight = paginationEl.offsetHeight;
        paginationHeight += offsetHeight || 0;
      } else {
        // TODO First fix 24
        paginationHeight += 24;
      }
    }

    let footerHeight = 0;
    if (!isBoolean(pagination)) {
      if (!footerEl) {
        footerEl = tableEl.querySelector('.ant-table-footer') as HTMLElement;
      } else {
        const offsetHeight = footerEl.offsetHeight;
        footerHeight += offsetHeight || 0;
      }
    }

    let headerHeight = 0;
    if (headEl) {
      headerHeight = (headEl as HTMLElement).offsetHeight;
    }

    const height =
      bottomIncludeBody -
      (resizeHeightOffset || 0) -
      paddingHeight -
      borderHeight -
      paginationHeight -
      footerHeight -
      headerHeight;

    setTimeout(() => {
      tableHeightRef.value = (height > maxHeight! ? (maxHeight as number) : height) ?? height;
      //  Solve the problem of modal adaptive height calculation when the form is placed in the modal
      modalFn?.redoModalHeight?.();
    }, 0);
  }

  useWindowSizeFn(calcTableHeight, 100);

  const getScrollRef = computed(() => {
    const tableHeight = unref(tableHeightRef);
    const { canResize, scroll } = unref(propsRef);

    return {
      x: '100%',
      y: canResize ? tableHeight : null,
      scrollToFirstRowOnChange: false,
      ...scroll,
    };
  });

  return { getScrollRef, redoHeight };
}
