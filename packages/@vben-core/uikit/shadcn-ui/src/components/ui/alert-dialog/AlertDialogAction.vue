<script setup lang="ts">
import { buttonVariants } from '#/components/ui/button';
import { cn } from '#/lib/utils';
import { AlertDialogAction, type AlertDialogActionProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & AlertDialogActionProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <AlertDialogAction
    v-bind="delegatedProps"
    :class="cn(buttonVariants(), props.class)"
  >
    <slot></slot>
  </AlertDialogAction>
</template>
