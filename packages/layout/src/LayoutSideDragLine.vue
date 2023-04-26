<script setup lang="ts">
  import type { CSSProperties } from 'vue';
  import { computed } from 'vue';

  defineOptions({ name: 'VbenLayoutSideDargLine' });

  interface Props {
    /**
     * 是否显示
     * @default true
     */
    show?: boolean;
  }

  withDefaults(defineProps<Props>(), {
    show: true,
  });

  const style = computed((): CSSProperties => {
    return {
      position: 'absolute',
      width: '2px',
      height: '100%',
      background: 'blue',
      right: '-1px',
      zIndex: 120,
      cursor: 'col-resize',
    };
  });
</script>

<template>
  <div :style="style"></div>
</template>
