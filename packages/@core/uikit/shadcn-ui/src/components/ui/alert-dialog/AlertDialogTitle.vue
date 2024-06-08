<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';

import { AlertDialogTitle, type AlertDialogTitleProps } from 'radix-vue';

import { cn } from '#/lib/utils';

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
