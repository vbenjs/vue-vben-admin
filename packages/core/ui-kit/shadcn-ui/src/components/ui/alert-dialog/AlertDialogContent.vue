<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared';

import {
  AlertDialogContent,
  type AlertDialogContentEmits,
  type AlertDialogContentProps,
  AlertDialogOverlay,
  AlertDialogPortal,
  useForwardPropsEmits,
} from 'radix-vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & AlertDialogContentProps
>();
const emits = defineEmits<AlertDialogContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <AlertDialogPortal>
    <AlertDialogOverlay
      class="bg-overlay data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[1000] backdrop-blur-sm"
    />
    <AlertDialogContent
      v-bind="forwarded"
      :class="
        cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] border-border fixed left-1/2 top-1/2 z-[1000] grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg',
          props.class,
        )
      "
    >
      <slot></slot>
    </AlertDialogContent>
  </AlertDialogPortal>
</template>
