<script setup lang="ts">
import type { VariantProps } from 'class-variance-authority';

import { toggleVariants } from '#/components/ui/toggle';
import { cn } from '#/lib/utils';
import {
  ToggleGroupItem,
  type ToggleGroupItemProps,
  useForwardProps,
} from 'radix-vue';
import { type HTMLAttributes, computed, inject } from 'vue';

type ToggleGroupVariants = VariantProps<typeof toggleVariants>;

const props = defineProps<
  {
    class?: HTMLAttributes['class'];
    size?: ToggleGroupVariants['size'];
    variant?: ToggleGroupVariants['variant'];
  } & ToggleGroupItemProps
>();

const context = inject<ToggleGroupVariants>('toggleGroup');

const delegatedProps = computed(() => {
  const { class: _, size: _size, variant: _variant, ...delegated } = props;
  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <ToggleGroupItem
    v-bind="forwardedProps"
    :class="
      cn(
        toggleVariants({
          variant: context?.variant || variant,
          size: context?.size || size,
        }),
        props.class,
      )
    "
  >
    <slot></slot>
  </ToggleGroupItem>
</template>
