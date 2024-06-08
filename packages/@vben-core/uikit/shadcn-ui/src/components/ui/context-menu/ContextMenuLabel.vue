<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';

import { ContextMenuLabel, type ContextMenuLabelProps } from 'radix-vue';

import { cn } from '#/lib/utils';

const props = defineProps<
  { class?: HTMLAttributes['class']; inset?: boolean } & ContextMenuLabelProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <ContextMenuLabel
    v-bind="delegatedProps"
    :class="
      cn(
        'text-foreground px-2 py-1.5 text-sm font-semibold',
        inset && 'pl-8',
        props.class,
      )
    "
  >
    <slot></slot>
  </ContextMenuLabel>
</template>
