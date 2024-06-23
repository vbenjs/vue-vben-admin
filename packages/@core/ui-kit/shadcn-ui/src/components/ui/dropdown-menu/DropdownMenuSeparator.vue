<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';

import { cn } from '@vben-core/toolkit';

import {
  DropdownMenuSeparator,
  type DropdownMenuSeparatorProps,
} from 'radix-vue';

const props = defineProps<
  {
    class?: HTMLAttributes['class'];
  } & DropdownMenuSeparatorProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <DropdownMenuSeparator
    v-bind="delegatedProps"
    :class="cn('bg-border -mx-1 my-1 h-px', props.class)"
  />
</template>
