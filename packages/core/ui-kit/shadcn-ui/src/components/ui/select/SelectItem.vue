<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared';

import { CheckIcon } from '@radix-icons/vue';
import {
  SelectItem,
  SelectItemIndicator,
  type SelectItemProps,
  SelectItemText,
  useForwardProps,
} from 'radix-vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & SelectItemProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectItem
    v-bind="forwardedProps"
    :class="
      cn(
        'focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class,
      )
    "
  >
    <span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectItemIndicator>
        <CheckIcon class="h-4 w-4" />
      </SelectItemIndicator>
    </span>

    <SelectItemText>
      <slot></slot>
    </SelectItemText>
  </SelectItem>
</template>
