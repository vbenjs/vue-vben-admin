<script setup lang="ts">
  import { useNamespace } from '@vben/hooks';
  import type { CSSProperties } from 'vue';
  import { computed } from 'vue';

  defineOptions({ name: 'VbenLayoutHeader' });

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
     * @default 60
     */
    height?: number;
    /**
     * 是否固定在顶部
     * @default true
     */
    fixed?: boolean;
    /**
     * 横屏
     * @default false
     */
    fullWidth?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    show: true,
    zIndex: 0,
    height: 60,
    fixed: true,
  });

  const { b, e } = useNamespace('layout-header');

  const hiddenHeaderStyle = computed((): CSSProperties => {
    const { height, show } = props;
    const heightValue = `${height}px`;
    return {
      marginTop: show ? 0 : `-${heightValue}`,
      height: heightValue,
      lineHeight: heightValue,
    };
  });

  const style = computed((): CSSProperties => {
    const { backgroundColor, height, fixed, zIndex, show, fullWidth } = props;
    const right = !show || !fullWidth ? undefined : 0;
    return {
      position: fixed ? 'fixed' : 'static',
      marginTop: show ? 0 : `-${height}px`,
      backgroundColor,
      height: `${height}px`,
      zIndex,
      right,
    };
  });
</script>

<template>
  <div :style="hiddenHeaderStyle" :class="e('hide')"></div>
  <header :style="style" :class="b()">
    <slot></slot>
  </header>
</template>

<style scoped module lang="scss">
  @include b('layout-header') {
    top: 0;
    width: 100%;
    transition: all 0.3s ease 0s;

    @include e('hide') {
      flex: 0 0 auto;
      width: 100%;
      background: transparent;
      transition: all 0.3s ease 0s;
    }
  }
</style>
