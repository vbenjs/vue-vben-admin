<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared';

import { Cross2Icon } from '@radix-icons/vue';
import { ToastClose, type ToastCloseProps } from 'radix-vue';

const props = defineProps<
  {
    class?: HTMLAttributes['class'];
  } & ToastCloseProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <ToastClose
    v-bind="delegatedProps"
    :class="
      cn(
        'text-foreground/50 hover:text-foreground absolute right-1 top-1 rounded-md p-1 opacity-0 transition-opacity focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
        props.class,
      )
    "
  >
    <Cross2Icon class="h-4 w-4" />
  </ToastClose>
</template>
