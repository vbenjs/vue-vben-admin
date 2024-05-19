<script setup lang="ts">
import { useNamespace } from '@vben-core/toolkit';

import type { CSSProperties } from 'vue';

import { computed } from 'vue';

interface Props {
  /**
   * 背景颜色
   */
  backgroundColor?: string;
  /**
   * 高度
   * @default 30
   */
  height?: number;
}

defineOptions({ name: 'LayoutTabs' });

const props = withDefaults(defineProps<Props>(), {
  backgroundColor: 'hsl(var(--color-background))',
  fixed: true,
  height: 30,
});

const { b, e } = useNamespace('tabs');

const hiddenStyle = computed((): CSSProperties => {
  const { height } = props;
  return {
    height: `${height}px`,
  };
});

const style = computed((): CSSProperties => {
  const { backgroundColor } = props;
  return {
    ...hiddenStyle.value,
    backgroundColor,
    display: 'flex',
  };
});
</script>

<template>
  <section :class="b()" :style="style">
    <slot></slot>
    <div :class="e('toolbar')">
      <slot name="toolbar"></slot>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '@vben-core/design/global';

@include b('tabs') {
  display: flex;
  width: 100%;
  border-bottom: 1px solid hsl(var(--color-border));
  // transition: all 0.2s;

  @include e('toolbar') {
    display: flex;
    align-items: center;
  }
}
</style>
