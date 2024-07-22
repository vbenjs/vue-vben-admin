<script setup lang="ts">
import type {
  PopoverContentProps,
  PopoverRootEmits,
  PopoverRootProps,
} from 'radix-vue';

import { computed, HTMLAttributes } from 'vue';

import {
  PopoverContent,
  Popover as PopoverRoot,
  PopoverTrigger,
} from '@vben-core/shadcn-ui/components/ui/popover';

import { useForwardPropsEmits } from 'radix-vue';

const props = withDefaults(
  defineProps<
    {
      class?: HTMLAttributes['class'];
      contentClass?: HTMLAttributes['class'];
      contentProps?: PopoverContentProps;
    } & PopoverRootProps
  >(),
  {},
);

const emits = defineEmits<PopoverRootEmits>();

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
  <PopoverRoot v-bind="forwarded">
    <PopoverTrigger>
      <slot name="trigger"></slot>

      <PopoverContent
        :class="contentClass"
        class="side-content z-[1000]"
        v-bind="contentProps"
      >
        <slot></slot>
      </PopoverContent>
    </PopoverTrigger>
  </PopoverRoot>
</template>
