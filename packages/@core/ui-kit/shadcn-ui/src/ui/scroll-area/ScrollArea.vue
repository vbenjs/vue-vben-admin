<script setup lang="ts">
import type { ScrollAreaRootProps } from 'reka-ui';

import { computed } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaViewport } from 'reka-ui';

import ScrollBar from './ScrollBar.vue';

const props = withDefaults(
  defineProps<
    ScrollAreaRootProps & {
      class?: any;
      onScroll?: (event: Event) => void;
      viewportProps?: { onScroll: (event: Event) => void };
    }
  >(),
  {
    onScroll: () => {},
  },
);

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <ScrollAreaRoot
    v-bind="delegatedProps"
    data-slot="scroll-area"
    :class="cn('relative overflow-hidden', props.class)"
  >
    <ScrollAreaViewport
      as-child
      data-slot="scroll-area-viewport"
      class="h-full w-full rounded-[inherit] focus:outline-hidden"
      @scroll="onScroll"
    >
      <slot></slot>
    </ScrollAreaViewport>
    <ScrollBar />
    <ScrollAreaCorner data-slot="scroll-area-corner" />
  </ScrollAreaRoot>
</template>
