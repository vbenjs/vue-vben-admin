<script setup lang="ts">
  import type { CSSProperties } from 'vue';
  import { computed } from 'vue';

  defineOptions({ name: 'VbenLayoutContent' });

  interface Props {
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
     * paddingTop
     * @default 16
     */
    paddingTop?: number;
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
  }

  const props = withDefaults(defineProps<Props>(), {
    padding: 16,
    paddingBottom: 16,
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  });

  const style = computed((): CSSProperties => {
    const { padding, paddingBottom, paddingTop, paddingLeft, paddingRight } = props;
    return {
      padding: `${padding}px`,
      paddingBottom: `${paddingBottom}px`,
      paddingTop: `${paddingTop}px`,
      paddingLeft: `${paddingLeft}px`,
      paddingRight: `${paddingRight}px`,
    };
  });
</script>

<template>
  <main :style="style" class="vben-admin-layout-content">
    <slot></slot>
  </main>
</template>
