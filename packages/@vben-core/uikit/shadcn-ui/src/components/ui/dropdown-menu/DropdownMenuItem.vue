<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';

import {
  DropdownMenuItem,
  type DropdownMenuItemProps,
  useForwardProps,
} from 'radix-vue';

import { cn } from '#/lib/utils';

const props = defineProps<
  { class?: HTMLAttributes['class']; inset?: boolean } & DropdownMenuItemProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <DropdownMenuItem
    v-bind="forwardedProps"
    :class="
      cn(
        'focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        inset && 'pl-8',
        props.class,
      )
    "
  >
    <slot></slot>
  </DropdownMenuItem>
</template>
