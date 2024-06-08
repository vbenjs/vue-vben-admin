<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';

import { SelectSeparator, type SelectSeparatorProps } from 'radix-vue';

import { cn } from '#/lib/utils';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & SelectSeparatorProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <SelectSeparator
    v-bind="delegatedProps"
    :class="cn('bg-muted -mx-1 my-1 h-px', props.class)"
  />
</template>
