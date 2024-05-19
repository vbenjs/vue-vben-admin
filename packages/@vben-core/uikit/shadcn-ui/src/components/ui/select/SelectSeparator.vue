<script setup lang="ts">
import { cn } from '#/lib/utils';
import { SelectSeparator, type SelectSeparatorProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

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
