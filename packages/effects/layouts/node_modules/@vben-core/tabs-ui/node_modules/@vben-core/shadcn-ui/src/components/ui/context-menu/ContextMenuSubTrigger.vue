<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared';

import { ChevronRightIcon } from '@radix-icons/vue';
import {
  ContextMenuSubTrigger,
  type ContextMenuSubTriggerProps,
  useForwardProps,
} from 'radix-vue';

const props = defineProps<
  {
    class?: HTMLAttributes['class'];
    inset?: boolean;
  } & ContextMenuSubTriggerProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <ContextMenuSubTrigger
    v-bind="forwardedProps"
    :class="
      cn(
        'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        inset && 'pl-8',
        props.class,
      )
    "
  >
    <slot></slot>
    <ChevronRightIcon class="ml-auto h-4 w-4" />
  </ContextMenuSubTrigger>
</template>
