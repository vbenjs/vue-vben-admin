<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';

import { buttonVariants } from '@vben-core/shadcn-ui/components/ui/button';
import { cn } from '@vben-core/shared';

import { AlertDialogAction, type AlertDialogActionProps } from 'radix-vue';

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
