import { BasicTableProps } from '../types/table';
import { computed, Ref, onMounted, unref, ref, nextTick, ComputedRef, watch } from 'compatible-vue';
import { getViewportOffset } from '@/utils/domUtils';
import { triggerWindowResize } from '@/utils/event/triggerWindowResizeEvent';
import { isBoolean } from '@/utils/is/index';
import { useTimeout } from '@/hooks/core/useTimeout';
import { useWindowSizeFn } from '@/hooks/event/useWindowSize';
import { useProps } from './useProps';

export function useTableScroll(refProps: ComputedRef<BasicTableProps>, tableElRef: Ref<any>) {
  const { propsRef } = useProps(refProps);

  const { scroll } = unref(propsRef);
  const tableHeightRef: Ref<number | null> = ref(null);

  watch(
    () => unref(propsRef).canResize,
    () => {
      redoHeight();
    }
  );
  function redoHeight() {
    const { canResize } = unref(propsRef);

    if (!canResize) {
      return;
    }
    calcTableHeight();
  }

  async function calcTableHeight(cb?: () => void) {
    const { canResize, resizeHeightOffset, pagination, maxHeight } = unref(propsRef);
    if (!canResize) {
      return;
    }
    await nextTick();
    const table = unref(tableElRef) as any;

    if (!table) {
      return;
    }
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
    const paddingHeight = 14 * 2 + 10;
    const borderHeight = 1 * 2;
    // 分页器高度

    // TODO 先固定20
    const paginationHeight = 20;
    // if (!isBoolean(pagination)) {
    //   const paginationDom = tableEl.querySelector('.ant-pagination') as HTMLElement;
    //   if (paginationDom) {
    //     const offsetHeight = paginationDom.offsetHeight;
    //     paginationHeight += offsetHeight || 0;
    //   }
    // }

    let footerHeight = 0;
    if (!isBoolean(pagination)) {
      const footerEl = tableEl.querySelector('.ant-table-footer') as HTMLElement;
      if (footerEl) {
        const offsetHeight = footerEl.offsetHeight;
        footerHeight += offsetHeight || 0;
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
      footerHeight -
      headerHeight;
    useTimeout(() => {
      tableHeightRef.value =
        tableHeightRef.value! > maxHeight! ? (maxHeight as number) : tableHeightRef.value;
      cb && cb();
    }, 0);
  }

  const getCanResize = computed(() => {
    const { canResize, scroll } = unref(propsRef);

    return canResize && !(scroll || {}).y;
  });
  unref(getCanResize) && useWindowSizeFn(calcTableHeight, 100);

  // function clear() {
  //   window.clearInterval(timer);
  // }

  onMounted(() => {
    if (unref(getCanResize)) {
      calcTableHeight();
      const hasFixedLeft = (unref(propsRef).columns || []).some((item) => item.fixed === 'left');
      // TODO antv table问题情况太多，只能先用下面方式定时器hack
      useTimeout(() => {
        calcTableHeight(() => {
          // 有左侧固定列的时候才有问题
          hasFixedLeft &&
            useTimeout(() => {
              triggerWindowResize();
            }, 300);
        });
      }, 200);
    }
  });
  const getScrollRef = computed(() => {
    const tableHeight = unref(tableHeightRef);
    return {
      x: '100%',
      y: tableHeight,
      scrollToFirstRowOnChange: false,
      ...scroll,
    };
  });
  return { getScrollRef, redoHeight };
}
