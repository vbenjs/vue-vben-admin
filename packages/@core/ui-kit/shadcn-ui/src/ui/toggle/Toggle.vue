<script setup lang="ts">
import type { ToggleEmits, ToggleProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import type { ToggleVariants } from '.';

import { cn } from '@vben-core/shared/utils';

import { reactiveOmit } from '@vueuse/core';
import { Toggle, useForwardPropsEmits } from 'reka-ui';

import { toggleVariants } from '.';

const props = withDefaults(
  defineProps<
    ToggleProps & {
      class?: HTMLAttributes['class'];
      size?: ToggleVariants['size'];
      variant?: ToggleVariants['variant'];
    }
  >(),
  {
    variant: 'default',
    size: 'default',
    disabled: false,
  },
);

const emits = defineEmits<ToggleEmits>();

const delegatedProps = reactiveOmit(props, 'class', 'size', 'variant');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <Toggle
    v-slot="slotProps"
    data-slot="toggle"
    v-bind="forwarded"
    :class="cn(toggleVariants({ variant, size }), props.class)"
  >
    <slot v-bind="slotProps"></slot>
  </Toggle>
</template>
