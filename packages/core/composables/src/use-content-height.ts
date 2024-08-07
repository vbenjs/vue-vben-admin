import { computed, onMounted, ref, watch } from 'vue';

import {
  CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT,
  getElementVisibleHeight,
} from '@vben-core/shared';

import { useCssVar, useDebounceFn, useWindowSize } from '@vueuse/core';
/**
 * @zh_CN 获取内容高度(可视区域，不包含滚动条)
 */
function useContentHeight() {
  const contentHeight = useCssVar(CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT);

  const contentStyles = computed(() => {
    return {
      height: `var(${CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT})`,
    };
  });

  return { contentHeight, contentStyles };
}

/**
 * @zh_CN 创建内容高度监听
 */
function useContentHeightListener() {
  const contentElement = ref<HTMLDivElement | null>(null);

  const { height, width } = useWindowSize();
  const contentHeight = useCssVar(CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT);
  const debouncedCalcHeight = useDebounceFn(() => {
    contentHeight.value = `${getElementVisibleHeight(contentElement.value)}px`;
  }, 200);

  watch([height, width], () => {
    debouncedCalcHeight();
  });

  onMounted(() => {
    debouncedCalcHeight();
  });

  return { contentElement };
}

export { useContentHeight, useContentHeightListener };
