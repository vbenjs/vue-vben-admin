<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';

import { cn } from '@vben-core/toolkit';

import { ToastTitle, type ToastTitleProps } from 'radix-vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & ToastTitleProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <ToastTitle
    v-bind="delegatedProps"
    :class="cn('text-sm font-semibold [&+div]:text-xs', props.class)"
  >
    <slot></slot>
  </ToastTitle>
</template>
