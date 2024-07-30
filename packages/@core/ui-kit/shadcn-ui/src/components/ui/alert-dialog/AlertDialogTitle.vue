<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared';

import { AlertDialogTitle, type AlertDialogTitleProps } from 'radix-vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & AlertDialogTitleProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <AlertDialogTitle
    v-bind="delegatedProps"
    :class="cn('text-lg font-semibold', props.class)"
  >
    <slot></slot>
  </AlertDialogTitle>
</template>
