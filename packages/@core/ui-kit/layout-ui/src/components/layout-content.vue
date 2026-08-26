<script setup lang="ts">
import type { CSSProperties } from 'vue';

import type { ContentCompactType } from '@vben-core/typings';

import { computed } from 'vue';

interface Props {
  /**
   * 内容区域定宽
   */
  contentCompact: ContentCompactType;
  /**
   * 定宽布局宽度
   */
  contentCompactWidth: number;
  padding: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
}

const props = withDefaults(defineProps<Props>(), {});

const overlayViewportStyle: CSSProperties = {
  height:
    'calc(var(--vben-viewport-height) - var(--vben-header-height, 0px) - var(--vben-footer-height, 0px))',
};

const style = computed((): CSSProperties => {
  const {
    contentCompact,
    padding,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
  } = props;

  const compactStyle: CSSProperties =
    contentCompact === 'compact'
      ? { margin: '0 auto', width: `${props.contentCompactWidth}px` }
      : {};
  return {
    ...compactStyle,
    flex: 1,
    minWidth: 0,
    padding: `${padding}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
    paddingRight: `${paddingRight}px`,
    paddingTop: `${paddingTop}px`,
  };
});
</script>

<template>
  <main :style="style" class="relative min-w-0">
    <div
      v-if="$slots.overlay"
      data-layout-region="content-overlay"
      class="pointer-events-none sticky top-0 z-150 h-0 w-full"
    >
      <div
        :style="overlayViewportStyle"
        data-layout-region="overlay-viewport"
        class="pointer-events-none relative min-h-0 w-full"
      >
        <slot name="overlay"></slot>
      </div>
    </div>
    <slot></slot>
  </main>
</template>
