<script setup lang="ts">
import type { TabsContentProps } from 'reka-ui';

import { computed } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { TabsContent } from 'reka-ui';

const props = defineProps<TabsContentProps & { class?: any }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <TabsContent
    v-bind="delegatedProps"
    data-slot="tabs-content"
    :class="
      cn(
        'mt-2 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        props.class,
      )
    "
  >
    <slot></slot>
  </TabsContent>
</template>
