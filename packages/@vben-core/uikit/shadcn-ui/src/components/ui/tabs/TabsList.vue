<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';

import { TabsList, type TabsListProps } from 'radix-vue';

import { cn } from '#/lib/utils';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & TabsListProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <TabsList
    v-bind="delegatedProps"
    :class="
      cn(
        'bg-muted text-muted-foreground inline-flex h-9 items-center justify-center rounded-lg p-1',
        props.class,
      )
    "
  >
    <slot></slot>
  </TabsList>
</template>
