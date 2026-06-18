<script setup lang="ts">
import type { ScrollAreaRootProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { reactiveOmit } from '@vueuse/core';
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaViewport } from 'reka-ui';

import ScrollBar from './ScrollBar.vue';

const props = defineProps<
  ScrollAreaRootProps & {
    class?: HTMLAttributes['class'];
    onScroll?: (event: Event) => void;
  }
>();

const delegatedProps = reactiveOmit(props, 'class', 'onScroll');
</script>

<template>
  <ScrollAreaRoot
    data-slot="scroll-area"
    v-bind="delegatedProps"
    :class="cn('relative overflow-hidden', props.class)"
  >
    <ScrollAreaViewport
      as-child
      data-slot="scroll-area-viewport"
      class="h-full w-full rounded-[inherit] focus:outline-hidden"
      @scroll="props.onScroll"
    >
      <slot></slot>
    </ScrollAreaViewport>
    <ScrollBar />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
