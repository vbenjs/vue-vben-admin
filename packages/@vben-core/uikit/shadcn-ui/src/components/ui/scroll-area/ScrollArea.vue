<script setup lang="ts">
import { cn } from '#/lib/utils';
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  type ScrollAreaRootProps,
  ScrollAreaViewport,
} from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

import ScrollBar from './ScrollBar.vue';

const props = withDefaults(
  defineProps<
    {
      class?: HTMLAttributes['class'];
      onScroll?: (event: Event) => void;
      viewportProps?: { onScroll: (event: Event) => void };
    } & ScrollAreaRootProps
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
    :class="cn('relative overflow-hidden', props.class)"
  >
    <ScrollAreaViewport
      class="h-full w-full rounded-[inherit]"
      as-child
      @scroll="onScroll"
    >
      <slot></slot>
    </ScrollAreaViewport>
    <ScrollBar />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
