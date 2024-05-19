<script setup lang="ts">
import { cn } from '#/lib/utils';
import {
  ContextMenuSeparator,
  type ContextMenuSeparatorProps,
} from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & ContextMenuSeparatorProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <ContextMenuSeparator
    v-bind="delegatedProps"
    :class="cn('bg-border -mx-1 my-1 h-px', props.class)"
  />
</template>
