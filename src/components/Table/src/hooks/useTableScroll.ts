import type { BasicTableProps } from '../types/table';
import { computed, Ref, onMounted, unref, ref, nextTick, ComputedRef, watch } from 'vue';

import { injectModal } from '/@/components/Modal/src/provideModal';

import { getViewportOffset } from '/@/utils/domUtils';
import { isBoolean } from '/@/utils/is';

import { useWindowSizeFn } from '/@/hooks/event/useWindowSizeFn';
import { useProps } from './useProps';

export function useTableScroll(refProps: ComputedRef<BasicTableProps>, tableElRef: Ref<any>) {
  const { propsRef } = useProps(refProps);

  const tableHeightRef: Ref<number | null> = ref(null);

  const redoModalHeight = injectModal();

  watch(
    () => unref(propsRef).canResize,
    () => {
      redoHeight();
    }
  );

  function redoHeight() {
    const { canResize } = unref(propsRef);

    if (!canResize) return;
    calcTableHeight();
  }

  let paginationEl: HTMLElement | null;
  let footerEl: HTMLElement | null;
  async function calcTableHeight() {
    const { canResize, resizeHeightOffset, pagination, maxHeight } = unref(propsRef);
    if (!canResize) return;

    await nextTick();
    const table = unref(tableElRef) as any;
    if (!table) return;

    const tableEl: Element = table.$el;
    if (!tableEl) return;
    const headEl = tableEl.querySelector('.ant-table-thead ');
    // const layoutMain: Element | null = document.querySelector('.default-layout__main ');
    if (!headEl) return;

    // 表格距离底部高度
    const { bottomIncludeBody } = getViewportOffset(headEl);
    // 表格高度+距离底部高度-自定义偏移量

    const paddingHeight = 32;
    const borderHeight = 2 * 2;
    // 分页器高度

    let paginationHeight = 2;
    if (!isBoolean(pagination)) {
      if (!paginationEl) {
        paginationEl = tableEl.querySelector('.ant-pagination') as HTMLElement;
      }
      if (paginationEl) {
        const offsetHeight = paginationEl.offsetHeight;
        paginationHeight += offsetHeight || 0;
      } else {
        // TODO 先固定24
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
    tableHeightRef.value =
      bottomIncludeBody -
      (resizeHeightOffset || 0) -
      paddingHeight -
      borderHeight -
      paginationHeight -
      footerHeight -
      headerHeight;

    setTimeout(() => {
      tableHeightRef.value =
        tableHeightRef.value! > maxHeight! ? (maxHeight as number) : tableHeightRef.value;
      //  解决表格放modal内的时候，modal自适应高度计算问题
      redoModalHeight && redoModalHeight();
    }, 16);
  }

  const getCanResize = computed(() => {
    const { canResize, scroll } = unref(propsRef);
    return canResize && !(scroll || {}).y;
  });

  useWindowSizeFn(calcTableHeight, 100);

  onMounted(() => {
    if (unref(getCanResize)) {
      nextTick(() => {
        calcTableHeight();
      });
    }
  });
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
