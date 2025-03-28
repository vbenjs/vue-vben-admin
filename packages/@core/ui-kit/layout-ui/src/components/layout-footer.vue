<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { computed } from 'vue';

import { useNamespace } from '@vben-core/composables';
import { cn } from '@vben-core/shared/utils';

interface Props {
  /**
   * 是否固定在底部
   */
  fixed?: boolean;
  height: number;
  /**
   * 是否显示
   * @default true
   */
  show?: boolean;
  width: string;
  zIndex: number;
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
});

const { b } = useNamespace('layout');
const style = computed((): CSSProperties => {
  const { fixed, height, show, width, zIndex } = props;
  return {
    height: `${height}px`,
    marginBottom: show ? '0' : `-${height}px`,
    position: fixed ? 'fixed' : 'static',
    width,
    zIndex,
  };
});
</script>

<template>
  <footer
    :class="
      cn(
        'bg-background-deep bottom-0 w-full transition-all duration-200',
        b('footer'),
      )
    "
    :style="style"
  >
    <slot></slot>
  </footer>
</template>
