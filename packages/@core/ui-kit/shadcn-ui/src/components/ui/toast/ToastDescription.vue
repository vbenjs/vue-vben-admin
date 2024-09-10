<script setup lang="ts">
import { computed } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { ToastDescription, type ToastDescriptionProps } from 'radix-vue';

const props = defineProps<{ class?: any } & ToastDescriptionProps>();

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
