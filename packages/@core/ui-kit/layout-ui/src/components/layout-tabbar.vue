<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed } from 'vue';

interface Props {
  /**
   * 高度
   * @default 30
   */
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  fixed: true,
  height: 30,
});

const style = computed((): CSSProperties => {
  const { height } = props;
  return {
    height: `${height}px`,
  };
});
</script>

<template>
  <section
    :style="style"
    class="border-border bg-background flex w-full border-b transition-all"
  >
    <slot></slot>
  </section>
</template>
