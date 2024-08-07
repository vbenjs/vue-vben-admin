<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared';

import { ChevronRightIcon } from '@radix-icons/vue';
import {
  DropdownMenuSubTrigger,
  type DropdownMenuSubTriggerProps,
  useForwardProps,
} from 'radix-vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & DropdownMenuSubTriggerProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <DropdownMenuSubTrigger
    v-bind="forwardedProps"
    :class="
      cn(
        'focus:bg-accent data-[state=open]:bg-accent flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        props.class,
      )
    "
  >
    <slot></slot>
    <ChevronRightIcon class="ml-auto h-4 w-4" />
  </DropdownMenuSubTrigger>
</template>
