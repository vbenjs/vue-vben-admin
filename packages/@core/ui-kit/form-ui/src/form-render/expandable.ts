import type { FormRenderProps } from '../types';

import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue';

import {
  breakpointsTailwind,
  useBreakpoints,
  useElementVisibility,
} from '@vueuse/core';

/**
 * 动态计算行数
 */
export function useExpandable(props: FormRenderProps) {
  const wrapperRef = useTemplateRef<HTMLElement>('wrapperRef');
  const isVisible = useElementVisibility(wrapperRef);
  const rowMapping = ref<Record<number, number>>({});
  // 是否已经计算过一次
  const isCalculated = ref(false);

  const breakpoints = useBreakpoints(breakpointsTailwind);

  const keepFormItemIndex = computed(() => {
    const rows = props.collapsedRows ?? 1;
    const mapping = rowMapping.value;
    let maxItem = 0;
    for (let index = 1; index <= rows; index++) {
      maxItem += mapping?.[index] ?? 0;
    }
    // 保持一行
    return maxItem - 1 || 1;
  });

  watch(
    [
      () => props.showCollapseButton,
      () => breakpoints.active().value,
      () => props.schema?.length,
      () => isVisible.value,
    ],
    async ([val]) => {
      if (val) {
        await nextTick();
        rowMapping.value = {};
        isCalculated.value = false;
        await calculateRowMapping();
      }
    },
  );

  async function calculateRowMapping() {
    if (!props.showCollapseButton) {
      return;
    }

    await nextTick();
    if (!wrapperRef.value) {
      return;
    }
    // 小屏幕不计算
    // if (breakpoints.smaller('sm').value) {
    //   // 保持一行
    //   rowMapping.value = { 1: 2 };
    //   return;
    // }

    const formItems = [...wrapperRef.value.children];
    const container = wrapperRef.value;
    const containerRect = container?.getBoundingClientRect();

    if (!containerRect) {
      return;
    }

    // 使用基于元素位置的行计算方案
    const rowPositions = new Map<number, number>(); // 位置到行号的映射
    const collapsedRows = props?.collapsedRows ?? 1;

    // 重置行映射
    rowMapping.value = {};

    // 单次遍历：收集位置、分配行号、统计数量
    formItems.forEach((el) => {
      const itemRect = el.getBoundingClientRect();
      const itemTop = itemRect.top - containerRect.top;

      // 找到或分配行号
      let rowNumber = 1;

      // 检查是否已存在相近位置
      const existingRow = [...rowPositions.entries()].find(
        ([position]) => Math.abs(itemTop - position) < 5,
      );

      if (existingRow) {
        rowNumber = existingRow[1];
      } else {
        // 如果是新位置，分配新行号
        rowNumber = rowPositions.size + 1;
        rowPositions.set(itemTop, rowNumber);
      }

      // 统计每行元素数量（仅统计折叠行数内的）
      if (rowNumber <= collapsedRows) {
        rowMapping.value[rowNumber] = (rowMapping.value[rowNumber] ?? 0) + 1;
      }
    });

    isCalculated.value = true;
  }

  onMounted(() => {
    calculateRowMapping();
  });

  return { isCalculated, keepFormItemIndex, wrapperRef };
}
