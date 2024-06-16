<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';

import { cn } from '@vben-core/toolkit';

import { buttonVariants } from '@vben-core/shadcn-ui/components/ui/button';
import { AlertDialogCancel, type AlertDialogCancelProps } from 'radix-vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & AlertDialogCancelProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <AlertDialogCancel
    v-bind="delegatedProps"
    :class="
      cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', props.class)
    "
  >
    <slot></slot>
  </AlertDialogCancel>
</template>
