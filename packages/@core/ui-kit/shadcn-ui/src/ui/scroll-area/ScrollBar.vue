<script setup lang="ts">
import type { ScrollAreaScrollbarProps } from 'reka-ui';

import { computed } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { ScrollAreaScrollbar, ScrollAreaThumb } from 'reka-ui';

const props = withDefaults(
  defineProps<ScrollAreaScrollbarProps & { class?: any }>(),
  {
    orientation: 'vertical',
  },
);

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <ScrollAreaScrollbar
    v-bind="delegatedProps"
    data-slot="scroll-area-scrollbar"
    :class="
      cn(
        'flex touch-none p-px transition-colors select-none',
        orientation === 'vertical' &&
          'h-full w-2.5 border-l border-l-transparent',
        orientation === 'horizontal' &&
          'h-2.5 flex-col border-t border-t-transparent',
        props.class,
      )
    "
  >
    <ScrollAreaThumb
      data-slot="scroll-area-thumb"
      class="bg-border relative flex-1 rounded-full"
    />
  </ScrollAreaScrollbar>
</template>
