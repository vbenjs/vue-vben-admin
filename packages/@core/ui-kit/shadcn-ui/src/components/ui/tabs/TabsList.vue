<script setup lang="ts">
import { computed } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { TabsList, type TabsListProps } from 'radix-vue';

const props = defineProps<{ class?: any } & TabsListProps>();

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
