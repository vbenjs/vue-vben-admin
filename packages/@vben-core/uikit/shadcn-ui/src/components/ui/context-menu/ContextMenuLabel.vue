<script setup lang="ts">
import { cn } from '#/lib/utils';
import { ContextMenuLabel, type ContextMenuLabelProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

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
