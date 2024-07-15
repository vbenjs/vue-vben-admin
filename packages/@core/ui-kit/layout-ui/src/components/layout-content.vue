<script setup lang="ts">
import type { ContentCompactType } from '@vben-core/typings';

import type { CSSProperties } from 'vue';
import { computed } from 'vue';

import { useContentHeightListener } from '@vben-core/hooks';

interface Props {
  /**
   * 内容区域定宽
   * @default 'wide'
   */
  contentCompact?: ContentCompactType;
  /**
   * 定宽布局宽度
   * @default 1200
   */
  contentCompactWidth?: number;
  /**
   * padding
   * @default 16
   */
  padding?: number;
  /**
   * paddingBottom
   * @default 16
   */
  paddingBottom?: number;
  /**
   * paddingLeft
   * @default 16
   */
  paddingLeft?: number;
  /**
   * paddingRight
   * @default 16
   */
  paddingRight?: number;
  /**
   * paddingTop
   * @default 16
   */
  paddingTop?: number;
}

const props = withDefaults(defineProps<Props>(), {
  contentCompact: 'wide',
  contentCompactWidth: 1200,
  padding: 16,
  paddingBottom: 16,
  paddingLeft: 16,
  paddingRight: 16,
  paddingTop: 16,
});

const { contentElement } = useContentHeightListener();

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
    padding: `${padding}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
    paddingRight: `${paddingRight}px`,
    paddingTop: `${paddingTop}px`,
  };
});
</script>

<template>
  <main ref="contentElement" :style="style" class="bg-background-content">
    <slot></slot>
  </main>
</template>
