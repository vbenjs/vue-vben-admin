<script setup lang="ts">
import { useScrollLock } from '@vben-core/composables';
import { cn } from '@vben-core/shared/utils';

const props = withDefaults(
  defineProps<{
    class?: any;
    overlayBlur?: number;
    position?: 'absolute' | 'fixed';
    zIndex?: number;
  }>(),
  {
    position: 'fixed',
  },
);

// 通过 v-if 控制挂载/卸载，组件卸载时 useScrollLock 自动解锁滚动
useScrollLock();
</script>

<template>
  <div
    :style="{
      ...(zIndex ? { zIndex } : {}),
      position,
      backdropFilter:
        overlayBlur && overlayBlur > 0 ? `blur(${overlayBlur}px)` : 'none',
    }"
    :class="cn('z-popup bg-overlay inset-0 fixed', props.class)"
  ></div>
</template>
