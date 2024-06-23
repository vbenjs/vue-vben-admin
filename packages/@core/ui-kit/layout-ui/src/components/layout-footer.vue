<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed } from 'vue';

interface Props {
  /**
   * 背景颜色
   */
  backgroundColor?: string;
  /**
   * 是否固定在顶部
   * @default true
   */
  fixed?: boolean;
  /**
   * 高度
   * @default 32
   */
  height?: number;
  /**
   * 是否显示
   * @default true
   */
  show?: boolean;
  /**
   * 高度
   * @default 100%
   */
  width?: string;
  /**
   * zIndex
   * @default 0
   */
  zIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  backgroundColor: 'hsl(var(--background))',
  fixed: true,
  height: 32,
  show: true,
  width: '100%',
  zIndex: 0,
});

const style = computed((): CSSProperties => {
  const { backgroundColor, fixed, height, show, width, zIndex } = props;
  return {
    backgroundColor,
    height: `${height}px`,
    marginBottom: show ? '0' : `-${height}px`,
    position: fixed ? 'fixed' : 'static',
    width,
    zIndex,
  };
});
</script>

<template>
  <footer :style="style" class="bottom-0 w-full transition-all duration-200">
    <slot></slot>
  </footer>
</template>
