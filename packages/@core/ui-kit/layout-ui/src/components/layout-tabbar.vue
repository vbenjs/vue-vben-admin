<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { computed } from 'vue';

import { useNamespace } from '@vben-core/composables';
import { cn } from '@vben-core/shared/utils';

interface Props {
  /**
   * 高度
   */
  height: number;
}

const props = withDefaults(defineProps<Props>(), {});

const { b } = useNamespace('layout');

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
    :class="
      cn(
        b('tabbar'),
        'border-border bg-background flex w-full border-b transition-all',
      )
    "
  >
    <slot></slot>
  </section>
</template>
