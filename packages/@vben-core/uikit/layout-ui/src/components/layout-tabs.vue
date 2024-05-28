<script setup lang="ts">
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
  <section :style="style" class="border-border flex w-full border-b">
    <slot></slot>
    <div class="flex items-center">
      <slot name="toolbar"></slot>
    </div>
  </section>
</template>
