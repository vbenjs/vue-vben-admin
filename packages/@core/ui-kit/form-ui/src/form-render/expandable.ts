import type { FormRenderProps } from '../types';

import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

/**
 * 动态计算行数
 */
export function useExpandable(props: FormRenderProps) {
  const wrapperRef = useTemplateRef<HTMLElement>('wrapperRef');
  const rowMapping = ref<Record<number, number>>({});

  const breakpoints = useBreakpoints(breakpointsTailwind);

  const keepFormItemIndex = computed(() => {
    const rows = props.collapsedRows ?? 1;
    const mapping = rowMapping.value;
    return (mapping?.[rows] ?? 1) - 1;
  });

  watch(
    [
      () => props.expandable,
      () => breakpoints.active().value,
      () => props.schema?.length,
    ],
    async ([val]) => {
      if (val) {
        await nextTick();
        rowMapping.value = {};
        calculateRowMapping();
      }
    },
    { immediate: true },
  );

  async function calculateRowMapping() {
    if (!props.expandable) {
      return;
    }

    await nextTick();
    if (!wrapperRef.value) {
      return;
    }
    // 小屏幕不计算
    if (breakpoints.smaller('sm').value) {
      // 保持一行
      rowMapping.value = { 1: 2 };
      return;
    }

    const formItems = [...wrapperRef.value.children];
    const container = wrapperRef.value;
    const containerStyles = window.getComputedStyle(container);
    const rowHeights = containerStyles
      .getPropertyValue('grid-template-rows')
      .split(' ');

    const containerRect = container?.getBoundingClientRect();

    formItems.forEach((el) => {
      const itemRect = el.getBoundingClientRect();

      // 计算元素在第几行
      const itemTop = itemRect.top - containerRect.top;
      let rowStart = 0;
      let cumulativeHeight = 0;

      for (const [i, rowHeight] of rowHeights.entries()) {
        cumulativeHeight += Number.parseFloat(rowHeight);
        if (itemTop < cumulativeHeight) {
          rowStart = i + 1;
          break;
        }
      }
      if (rowStart > (props?.collapsedRows ?? 1)) {
        return;
      }
      rowMapping.value[rowStart] = (rowMapping.value[rowStart] ?? 0) + 1;
    });
  }

  return { keepFormItemIndex, wrapperRef };
}
