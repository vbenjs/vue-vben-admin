<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { ref } from 'vue';

import { cn } from '@vben-core/toolkit';

import { ScrollArea } from '@vben-core/shadcn-ui/components/ui/scroll-area';

interface Props {
  class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
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
    :class="[
      cn(props.class),
      {
        // 'shadow-none': isAtTop && isAtBottom,
        // shadow: !isAtTop || !isAtBottom,
        // 'dark:shadow-white/20': !isAtTop || !isAtBottom,
        // 'shadow-inner': !isAtBottom,
        // 'dark:shadow-inner-white/20': !isAtBottom,
      },
    ]"
    :on-scroll="handleScroll"
  >
    <slot></slot>
  </ScrollArea>
</template>
