<script setup lang="ts">
import { buttonVariants } from '#/components/ui/button';
import { cn } from '#/lib/utils';
import { AlertDialogCancel, type AlertDialogCancelProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

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
