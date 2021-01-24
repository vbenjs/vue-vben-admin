import type { BasicTableProps, TableRowSelection } from '../types/table';
import type { Ref, ComputedRef } from 'vue';
import { computed, unref, ref, nextTick, watch } from 'vue';

import { getViewportOffset } from '/@/utils/domUtils';
import { isBoolean } from '/@/utils/is';

import { useWindowSizeFn } from '/@/hooks/event/useWindowSizeFn';
import { useModalContext } from '/@/components/Modal';
import { useDebounce } from '/@/hooks/core/useDebounce';
import type { BasicColumn } from '/@/components/Table';

export function useTableScroll(
  propsRef: ComputedRef<BasicTableProps>,
  tableElRef: Ref<ComponentRef>,
  columnsRef: ComputedRef<BasicColumn[]>,
  rowSelectionRef: ComputedRef<TableRowSelection<any> | null>
) {
  const tableHeightRef: Ref<Nullable<number>> = ref(null);

  const modalFn = useModalContext();

  // const [debounceCalcTableHeight] = useDebounce(calcTableHeight, 80);
  const [debounceRedoHeight] = useDebounce(redoHeight, 250);

  const getCanResize = computed(() => {
    const { canResize, scroll } = unref(propsRef);
    return canResize && !(scroll || {}).y;
  });

  watch(
    () => unref(getCanResize),
    () => {
      debounceRedoHeight();
    },
    {
      immediate: true,
    }
  );

  function redoHeight() {
    if (unref(getCanResize)) {
      nextTick(() => {
        calcTableHeight();
      });
    }
  }

  function setHeight(heigh: number) {
    tableHeightRef.value = heigh;
    //  Solve the problem of modal adaptive height calculation when the form is placed in the modal
    modalFn?.redoModalHeight?.();
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

    let height =
      bottomIncludeBody -
      (resizeHeightOffset || 0) -
      paddingHeight -
      borderHeight -
      paginationHeight -
      footerHeight -
      headerHeight;

    height = (height > maxHeight! ? (maxHeight as number) : height) ?? height;
    setHeight(height);
  }

  useWindowSizeFn(calcTableHeight, 200);

  const getScrollX = computed(() => {
    let width = 0;
    if (unref(rowSelectionRef)) {
      width += 60;
    }

    // TODO props ?? 0;
    const NORMAL_WIDTH = 150;

    const columns = unref(columnsRef).filter((item) => !item.defaultHidden);
    columns.forEach((item) => {
      width += Number.parseInt(item.width as string) || 0;
    });
    const unsetWidthColumns = columns.filter((item) => !Reflect.has(item, 'width'));

    const len = unsetWidthColumns.length;
    if (len !== 0) {
      width += len * NORMAL_WIDTH;
    }

    const table = unref(tableElRef);
    const tableWidth = table?.$el?.offsetWidth ?? 0;
    return tableWidth > width ? '100%' : width;
  });

  const getScrollRef = computed(() => {
    const tableHeight = unref(tableHeightRef);
    const { canResize, scroll } = unref(propsRef);
    return {
      x: unref(getScrollX),
      y: canResize ? tableHeight : null,
      scrollToFirstRowOnChange: false,
      ...scroll,
    };
  });

  return { getScrollRef, redoHeight };
}
