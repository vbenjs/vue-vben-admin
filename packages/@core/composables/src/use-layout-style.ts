import type { CSSProperties } from 'vue';

import { computed, ref } from 'vue';

import {
  CSS_VARIABLE_LAYOUT_FOOTER_HEIGHT,
  CSS_VARIABLE_LAYOUT_HEADER_HEIGHT,
} from '@vben-core/shared/constants';

import { useCssVar } from '@vueuse/core';

/**
 * @zh_CN content style
 */
export function useLayoutContentStyle() {
  const contentElement = ref<HTMLDivElement | null>(null);

  const overlayStyle = computed(
    (): CSSProperties => ({ inset: 0, position: 'absolute', zIndex: 150 }),
  );

  return { contentElement, overlayStyle };
}

export function useLayoutHeaderStyle() {
  const headerHeight = useCssVar(CSS_VARIABLE_LAYOUT_HEADER_HEIGHT);

  return {
    getLayoutHeaderHeight: () => {
      return Number.parseInt(`${headerHeight.value}`, 10);
    },
    setLayoutHeaderHeight: (height: number) => {
      headerHeight.value = `${height}px`;
    },
  };
}

export function useLayoutFooterStyle() {
  const footerHeight = useCssVar(CSS_VARIABLE_LAYOUT_FOOTER_HEIGHT);

  return {
    getLayoutFooterHeight: () => {
      return Number.parseInt(`${footerHeight.value}`, 10);
    },
    setLayoutFooterHeight: (height: number) => {
      footerHeight.value = `${height}px`;
    },
  };
}
