<script setup lang="ts">
  import { useNamespace } from '@vben/hooks';
  import type { CSSProperties } from 'vue';
  import { computed } from 'vue';

  defineOptions({ name: 'VbenLayoutFooter' });

  interface Props {
    /**
     * 是否显示
     * @default true
     */
    show?: boolean;
    /**
     * zIndex
     * @default 0
     */
    zIndex?: number;
    /**
     * 背景颜色
     */
    backgroundColor: string;
    /**
     * 高度
     * @default 32
     */
    height?: number;
    /**
     * 是否固定在顶部
     * @default true
     */
    fixed?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    show: true,
    zIndex: 0,
    height: 32,
    fixed: true,
  });

  const { b } = useNamespace('layout-footer');

  const style = computed((): CSSProperties => {
    const { backgroundColor, height, fixed, zIndex, show } = props;
    return {
      position: fixed ? 'fixed' : 'static',
      zIndex,
      backgroundColor,
      height: `${height}px`,
      marginBottom: show ? '0' : `-${height}px`,
    };
  });
</script>

<template>
  <footer :class="b()" :style="style">
    <slot></slot>
  </footer>
</template>

<style scoped module lang="scss">
  @include b('layout-footer') {
    bottom: 0;
    width: 100%;
    transition: all 0.3s;
  }
</style>
