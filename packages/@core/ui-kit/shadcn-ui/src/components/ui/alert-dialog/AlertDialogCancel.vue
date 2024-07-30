<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';

import { buttonVariants } from '@vben-core/shadcn-ui/components/ui/button';
import { cn } from '@vben-core/shared';

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
