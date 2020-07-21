import { BasicTableProps } from '../types/table';
import { computed, Ref, onMounted, unref, ref, nextTick } from 'compatible-vue';
import { getViewportOffset } from '@/utils/domUtils';
import { isBoolean } from '@/utils/is/index';
import { useTimeout } from '@/hooks/core/useTimeout';
import { useWindowSizeFn } from '@/hooks/event/useWindowSize';

export function useTableScroll(props: BasicTableProps, tableElRef: Ref<any>) {
  const { scroll } = props;
  const tableHeightRef: Ref<number | null> = ref(null);

  function redoHeight() {
    const { canResize } = props;

    if (!canResize) {
      return;
    }
    calcTableHeight();
  }

  async function calcTableHeight() {
    const { canResize, resizeHeightOffset, pagination, maxHeight } = props;
    if (!canResize) {
      return;
    }
    await nextTick();
    const table = unref(tableElRef) as any;
    const tableEl: Element = table.$el;
    if (!tableEl) {
      return;
    }
    const el: Element | null = tableEl.querySelector('.ant-table-thead ');

    if (!el) {
      return;
    }
    // 表格距离底部高度
    const { bottomIncludeBody } = getViewportOffset(el);

    // 表格高度+距离底部高度-自定义偏移量
    const paddingHeight = 16 * 2;
    const borderHeight = 1 * 2;
    // 分页器高度

    let paginationHeight = 0;
    if (!isBoolean(pagination)) {
      const paginationDom = tableEl.querySelector('.ant-pagination') as HTMLElement;
      if (paginationDom) {
        const offsetHeight = paginationDom.offsetHeight;
        paginationHeight += offsetHeight || 0;
      }
    }
    let headerHeight = 0;
    if (el) {
      headerHeight = (el as HTMLElement).offsetHeight;
    }
    tableHeightRef.value =
      bottomIncludeBody -
      (resizeHeightOffset || 0) -
      paddingHeight -
      borderHeight -
      paginationHeight -
      headerHeight;
    useTimeout(() => {
      tableHeightRef.value =
        tableHeightRef.value! > maxHeight! ? (maxHeight as number) : tableHeightRef.value;
    }, 50);
  }
  const { canResize } = props;
  canResize && useWindowSizeFn(calcTableHeight, 180);

  // function clear() {
  //   window.clearInterval(timer);
  // }
  onMounted(() => {
    calcTableHeight();
  });
  const getScrollRef = computed(() => {
    const tableHeight = unref(tableHeightRef);
    return {
      x: true,
      y: tableHeight,
      scrollToFirstRowOnChange: false,
      ...scroll,
    };
  });
  return { getScrollRef, redoHeight };
}
