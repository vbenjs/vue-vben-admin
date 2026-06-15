<script setup lang="ts">
import type { VariantProps } from 'class-variance-authority';
import type { ToggleGroupItemProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { inject } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { reactiveOmit } from '@vueuse/core';
import { ToggleGroupItem, useForwardProps } from 'reka-ui';

import { toggleVariants } from '../toggle';

type ToggleGroupVariants = VariantProps<typeof toggleVariants> & {
  spacing?: number;
};

const props = defineProps<
  ToggleGroupItemProps & {
    class?: HTMLAttributes['class'];
    size?: ToggleGroupVariants['size'];
    variant?: ToggleGroupVariants['variant'];
  }
>();

const context = inject<ToggleGroupVariants>('toggleGroup');

const delegatedProps = reactiveOmit(props, 'class', 'size', 'variant');
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <ToggleGroupItem
    v-slot="slotProps"
    data-slot="toggle-group-item"
    :data-variant="context?.variant || variant"
    :data-size="context?.size || size"
    :data-spacing="context?.spacing"
    v-bind="forwardedProps"
    :class="
      cn(
        toggleVariants({
          variant: context?.variant || variant,
          size: context?.size || size,
        }),
        'w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10',
        'data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md data-[variant=outline]:[&:not(:first-child)]:-ml-px data-[spacing=0]:data-[variant=outline]:first:border-l',
        props.class,
      )
    "
  >
    <slot v-bind="slotProps"></slot>
  </ToggleGroupItem>
</template>
