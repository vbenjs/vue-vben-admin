<script setup lang="ts">
import type { toggleVariants } from '@vben-core/shadcn-ui/components/ui/toggle';
import type { VariantProps } from 'class-variance-authority';

import { computed, type HTMLAttributes, provide } from 'vue';

import { cn } from '@vben-core/shared';

import {
  ToggleGroupRoot,
  type ToggleGroupRootEmits,
  type ToggleGroupRootProps,
  useForwardPropsEmits,
} from 'radix-vue';

type ToggleGroupVariants = VariantProps<typeof toggleVariants>;

const props = defineProps<
  {
    class?: HTMLAttributes['class'];
    size?: ToggleGroupVariants['size'];
    variant?: ToggleGroupVariants['variant'];
  } & ToggleGroupRootProps
>();
const emits = defineEmits<ToggleGroupRootEmits>();

provide('toggleGroup', {
  size: props.size,
  variant: props.variant,
});

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <ToggleGroupRoot
    v-bind="forwarded"
    :class="cn('flex items-center justify-center gap-1', props.class)"
  >
    <slot></slot>
  </ToggleGroupRoot>
</template>
