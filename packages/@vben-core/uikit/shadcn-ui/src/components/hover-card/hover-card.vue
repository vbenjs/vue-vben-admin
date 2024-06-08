<script setup lang="ts">
import type { HoverCardRootEmits, HoverCardRootProps } from 'radix-vue';

import { HTMLAttributes, computed } from 'vue';

import { HoverCardContentProps, useForwardPropsEmits } from 'radix-vue';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '#/components/ui/hover-card';

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
