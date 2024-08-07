<script setup lang="ts">
import type {
  HoverCardContentProps,
  HoverCardRootEmits,
  HoverCardRootProps,
} from 'radix-vue';

import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@vben-core/shadcn-ui/components/ui/hover-card';

import { useForwardPropsEmits } from 'radix-vue';

const props = defineProps<
  {
    class?: HTMLAttributes['class'];
    contentClass?: HTMLAttributes['class'];
    contentProps?: HoverCardContentProps;
  } & HoverCardRootProps
>();

const emits = defineEmits<HoverCardRootEmits>();

const delegatedProps = computed(() => {
  const {
    class: _cls,
    contentClass: _,
    contentProps: _cProps,
    ...delegated
  } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <HoverCard v-bind="forwarded">
    <HoverCardTrigger as-child class="h-full">
      <div class="h-full cursor-pointer">
        <slot name="trigger"></slot>
      </div>
    </HoverCardTrigger>
    <HoverCardContent
      :class="contentClass"
      v-bind="contentProps"
      class="side-content z-[1000]"
    >
      <slot></slot>
    </HoverCardContent>
  </HoverCard>
</template>
