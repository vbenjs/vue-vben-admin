<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';

import { SelectGroup, type SelectGroupProps } from 'radix-vue';

import { cn } from '#/lib/utils';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & SelectGroupProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <SelectGroup :class="cn('w-full p-1', props.class)" v-bind="delegatedProps">
    <slot></slot>
  </SelectGroup>
</template>
