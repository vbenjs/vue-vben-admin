import type { BasicTableProps, TableRowSelection, BasicColumn } from '../types/table';
import { Ref, ComputedRef, ref, computed, unref, nextTick, watch } from 'vue';
import { getViewportOffset } from '@/utils/domUtils';
import { isBoolean } from '@/utils/is';
import { useWindowSizeFn, onMountedOrActivated } from '@vben/hooks';
import { useModalContext } from '@/components/Modal';
import { useDebounceFn, promiseTimeout } from '@vueuse/core';

import {
  footerHeight as layoutFooterHeight,
  layoutMultipleHeadePlaceholderTime,
} from '@/settings/designSetting';

import { useRootSetting } from '@/hooks/setting/useRootSetting';

const { getShowFooter, getFullContent } = useRootSetting();

export function useTableScroll(
  propsRef: ComputedRef<BasicTableProps>,
  tableElRef: Ref<ComponentRef>,
  columnsRef: ComputedRef<BasicColumn[]>,
  rowSelectionRef: ComputedRef<TableRowSelection | null>,
  getDataSourceRef: ComputedRef<Recordable[]>,
  wrapRef: Ref<HTMLElement | null>,
  formRef: Ref<ComponentRef>,
) {
  const tableHeightRef: Ref<Nullable<number | string>> = ref(167);
  const modalFn = useModalContext();

  // Greater than animation time 280
  const debounceRedoHeight = useDebounceFn(redoHeight, 100);

  const getCanResize = computed(() => {
    const { canResize, scroll } = unref(propsRef);
    return canResize && !(scroll || {}).y;
  });

  watch(
    () => [unref(getCanResize), unref(getDataSourceRef)?.length, unref(getShowFooter)],
    () => {
      debounceRedoHeight();
    },
    {
      flush: 'post',
    },
  );

  watch(
    () => [unref(getFullContent)],
    async () => {
      // 等待动画结束后200毫秒
      await promiseTimeout(layoutMultipleHeadePlaceholderTime * 1000 + 200);
      debounceRedoHeight();
    },
    {
      flush: 'post',
    },
  );

  function redoHeight() {
    nextTick(() => {
      calcTableHeight();
    });
  }

  function setHeight(height: number) {
    tableHeightRef.value = height;
    //  Solve the problem of modal adaptive height calculation when the form is placed in the modal
    modalFn?.redoModalHeight?.();
  }

  // No need to repeat queries
  let paginationEl: HTMLElement | null;
  let footerEl: HTMLElement | null;
  let bodyEl: HTMLElement | null;

  /**
   * table wrapper padding 的高度
   * @description 来自于 .vben-basic-table .ant-table-wrapper
   */
  const tableWrapperPadding = 6;

  function handleScrollBar(bodyEl: HTMLElement, tableEl: Element) {
    const hasScrollBarY = bodyEl.scrollHeight > bodyEl.clientHeight;
    const hasScrollBarX = bodyEl.scrollWidth > bodyEl.clientWidth;

    if (hasScrollBarY) {
      tableEl.classList.contains('hide-scrollbar-y') &&
        tableEl.classList.remove('hide-scrollbar-y');
    } else {
      !tableEl.classList.contains('hide-scrollbar-y') && tableEl.classList.add('hide-scrollbar-y');
    }

    if (hasScrollBarX) {
      tableEl.classList.contains('hide-scrollbar-x') &&
        tableEl.classList.remove('hide-scrollbar-x');
    } else {
      !tableEl.classList.contains('hide-scrollbar-x') && tableEl.classList.add('hide-scrollbar-x');
    }
  }

  /**
   * 计算分页器高度
   * @param tableEl table element
   * @returns number
   */
  function caclPaginationHeight(tableEl: Element): number {
    const { pagination } = unref(propsRef);

    let paginationHeight = 0;
    if (!isBoolean(pagination)) {
      // 从 Dom 获取
      if (!paginationEl) {
        paginationEl = tableEl.querySelector('.ant-pagination') as HTMLElement;
      }
      if (paginationEl) {
        // 分页 margin-top
        const paginationElMarginTop =
          parseInt(getComputedStyle(paginationEl)?.marginTop) || 10 + 24;
        // 分页高度
        const offsetHeight = paginationEl.offsetHeight;
        paginationHeight = offsetHeight + paginationElMarginTop;
      } else {
        // 找不到分页组件，缺省给予默认分页 margin-top + 高度
        paginationHeight = 10 + 24;
      }
    } else {
      // 不显示分页，pagination 为 false 的时候
      paginationHeight = 0;
    }
    return paginationHeight;
  }

  function caclFooterHeight(tableEl: Element): number {
    const { pagination } = unref(propsRef);
    let footerHeight = 0;
    if (!isBoolean(pagination)) {
      if (!footerEl) {
        footerEl = tableEl.querySelector('.ant-table-footer') as HTMLElement;
      } else {
        const offsetHeight = footerEl.offsetHeight;
        footerHeight += offsetHeight || 0;
      }
    }
    return footerHeight;
  }

  function calcHeaderHeight(headEl: Element): number {
    let headerHeight = 0;
    if (headEl) {
      headerHeight = (headEl as HTMLElement).offsetHeight;
    }
    return headerHeight;
  }

  /**
   * 计算从表头一直到body底部的总高度
   * @param tableEl table element
   * @param headEl table 页头 element
   * @returns number
   */
  function calcBottomAndPaddingHeight(tableEl: Element, headEl: Element) {
    const { isCanResizeParent } = unref(propsRef);
    let bottomIncludeBody = 0;
    if (unref(wrapRef) && isCanResizeParent) {
      // 继承父元素高度
      const wrapHeight = unref(wrapRef)?.offsetHeight ?? 0;

      let formHeight = unref(formRef)?.$el.offsetHeight ?? 0;
      if (formHeight) {
        // 来自于 .vben-basic-table-form-container .ant-form 以及 .vben-basic-table-form-container
        formHeight += 16 + 16 * 2;
      }

      bottomIncludeBody = wrapHeight - tableWrapperPadding - formHeight;
    } else {
      // 缺省 wrapRef 情况下
      bottomIncludeBody = getViewportOffset(headEl).bottomIncludeBody;
    }

    return bottomIncludeBody;
  }

  /**
   * 计算 table 在 modal 内 modal 所占用的高度
   * @param tableEl table element
   * @returns number
   */
  function calcModalHeight(tableEl: Element) {
    // 找一下 table 是否在 modal 内，获得 modal、wrap、footer，并考虑 fullscreen 的情况
    let modalEl: Nullable<HTMLElement> = null;
    let modalWrapEl: Nullable<HTMLElement> = null;
    let modalFooterEl: Nullable<HTMLElement> = null;
    let modalElIterator: HTMLElement = tableEl.parentElement!;
    let modalIsFullscreen = false;
    while (modalElIterator !== document.body) {
      if (!modalElIterator) break;
      if (modalElIterator.classList.contains('ant-modal')) {
        modalEl = modalElIterator;
        modalWrapEl = modalEl.parentElement;
        modalFooterEl = modalElIterator.querySelector('.ant-modal-content>.ant-modal-footer');
        modalIsFullscreen = modalWrapEl?.classList.contains('fullscreen-modal') ?? false;
        break;
      }
      modalElIterator = modalElIterator.parentElement!;
    }

    if (modalEl) {
      // table 在 modal 内

      // modal top
      const { top: modalTop = 0 } = modalEl ? getViewportOffset(modalEl) : {};

      // 来自于 .ant-modal，非全屏为 24，全屏为 0
      const modalBottom = modalIsFullscreen ? 0 : 24;

      //  modal footer 高度
      const modalFooterHeight = modalFooterEl?.offsetHeight ?? 0;

      // modal footer 边距，来自于 .ant-modal .ant-modal-footer
      const modalFooterMarginTop = modalFooterEl
        ? modalIsFullscreen
          ? 0
          : parseInt(getComputedStyle(modalFooterEl).marginTop)
        : 0;

      // 来自于 .ant-modal .ant-modal-body > .scrollbar
      const modalScrollBarHeight = 14;

      return (
        (modalTop > modalBottom ? modalTop : modalBottom) +
        modalFooterHeight +
        modalFooterMarginTop +
        modalScrollBarHeight
      );
    }

    // table 不住 modal 内
    return 0;
  }

  /**
   * 根据样式返回一些间距高度
   * @returns number
   */
  function getMarginPaddingHeight() {
    const { isCanResizeParent } = unref(propsRef);

    if (unref(wrapRef) && isCanResizeParent) {
      // 继承父元素高度
      return tableWrapperPadding;
    }
    return (
      tableWrapperPadding + 16 // 来自于 .vben-basic-table-form-container 或是 .p-4
    );
  }

  async function calcTableHeight() {
    const { resizeHeightOffset, maxHeight } = unref(propsRef);
    const tableData = unref(getDataSourceRef);

    const table = unref(tableElRef);
    if (!table) return;

    const tableEl: Element = table.$el;
    if (!tableEl) return;

    if (!bodyEl) {
      bodyEl = tableEl.querySelector('.ant-table-body');
      if (!bodyEl) return;
    }

    handleScrollBar(bodyEl, tableEl);

    bodyEl!.style.height = 'unset';

    if (!unref(getCanResize) || !unref(tableData) || tableData.length === 0) return;

    await nextTick();
    // Add a delay to get the correct bottomIncludeBody paginationHeight footerHeight headerHeight

    const headEl = tableEl.querySelector('.ant-table-thead ');

    if (!headEl) return;

    const paginationHeight = caclPaginationHeight(tableEl);
    const footerHeight = caclFooterHeight(tableEl);
    const headerHeight = calcHeaderHeight(headEl);
    const bottomIncludeBody = calcBottomAndPaddingHeight(tableEl, headEl);

    const modalHeight = calcModalHeight(tableEl);

    const marginPaddingHeight = getMarginPaddingHeight();

    // Math.floor 宁愿小1px，也不溢出
    let height = Math.floor(
      bottomIncludeBody -
        (resizeHeightOffset || 0) -
        paginationHeight -
        footerHeight -
        headerHeight -
        // 弹窗（如果有）相关高度
        modalHeight -
        // 页面 footer 高度（非弹窗的时候）
        (getShowFooter.value && modalHeight <= 0 ? layoutFooterHeight : 0) -
        // 样式间距高度
        marginPaddingHeight -
        // 预留非整数高度溢出（如实际高度为100.5，offsetHeight 的值为101）
        1,
    );

    height = (height > maxHeight! ? (maxHeight as number) : height) ?? height;
    setHeight(height);

    bodyEl!.style.height = `${height}px`;
  }
  useWindowSizeFn(calcTableHeight, { wait: 280 });
  onMountedOrActivated(() => {
    calcTableHeight();
    nextTick(() => {
      debounceRedoHeight();
    });
  });

  const getScrollX = computed(() => {
    let width = 0;
    if (unref(rowSelectionRef)) {
      width += 60;
    }

    // TODO props ?? 0;
    const NORMAL_WIDTH = 150;

    const columns = unref(columnsRef).filter((item) => !item.defaultHidden);
    columns.forEach((item) => {
      width += Number.parseFloat(item.width as string) || 0;
    });
    const unsetWidthColumns = columns.filter(
      (item) => !Reflect.has(item, 'width') && item.ifShow !== false,
    );

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
    } as BasicTableProps['scroll'];
  });

  return { getScrollRef, redoHeight };
}
