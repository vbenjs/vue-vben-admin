<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared';

import { ToastDescription, type ToastDescriptionProps } from 'radix-vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & ToastDescriptionProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <ToastDescription
    :class="cn('text-sm opacity-90', props.class)"
    v-bind="delegatedProps"
  >
    <slot></slot>
  </ToastDescription>
</template>
