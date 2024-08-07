<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { ref } from 'vue';

import {
  ScrollArea,
  ScrollBar,
} from '@vben-core/shadcn-ui/components/ui/scroll-area';
import { cn } from '@vben-core/shared';

interface Props {
  class?: HTMLAttributes['class'];
  horizontal?: boolean;
  scrollBarClass?: HTMLAttributes['class'];
  shadow?: boolean;
  shadowBorder?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  horizontal: false,
  shadow: false,
  shadowBorder: false,
});

const isAtTop = ref(true);
const isAtBottom = ref(false);

function handleScroll(event: Event) {
  const target = event.target as HTMLElement;
  const scrollTop = target?.scrollTop ?? 0;
  const offsetHeight = target?.offsetHeight ?? 0;
  const scrollHeight = target?.scrollHeight ?? 0;
  isAtTop.value = scrollTop <= 0;
  isAtBottom.value = scrollTop + offsetHeight >= scrollHeight;
}
</script>

<template>
  <ScrollArea
    :class="[cn(props.class)]"
    :on-scroll="handleScroll"
    class="relative"
  >
    <div
      v-if="shadow"
      :class="{
        'opacity-100': !isAtTop,
        'border-border border-t': shadowBorder && !isAtTop,
      }"
      class="scrollbar-top-shadow pointer-events-none absolute top-0 z-10 h-12 w-full opacity-0 transition-opacity duration-300 ease-in-out will-change-[opacity]"
    ></div>
    <slot></slot>
    <div
      v-if="shadow"
      :class="{
        'opacity-100': !isAtTop && !isAtBottom,
        'border-border border-b': shadowBorder && !isAtTop && !isAtBottom,
      }"
      class="scrollbar-bottom-shadow pointer-events-none absolute bottom-0 z-10 h-12 w-full opacity-0 transition-opacity duration-300 ease-in-out will-change-[opacity]"
    ></div>
    <ScrollBar
      v-if="horizontal"
      :class="scrollBarClass"
      orientation="horizontal"
    />
  </ScrollArea>
</template>

<style scoped>
.scrollbar-top-shadow {
  background: linear-gradient(
    to bottom,
    hsl(var(--scroll-shadow, var(--background))),
    transparent
  );
}

.scrollbar-bottom-shadow {
  background: linear-gradient(
    to top,
    hsl(var(--scroll-shadow, var(--background))),
    transparent
  );
}
</style>
