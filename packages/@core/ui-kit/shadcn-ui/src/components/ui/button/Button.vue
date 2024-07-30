<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared';

import { Primitive, type PrimitiveProps } from 'radix-vue';

import { type ButtonVariants, buttonVariants } from './button';

interface Props extends PrimitiveProps {
  class?: HTMLAttributes['class'];
  size?: ButtonVariants['size'];
  variant?: 'heavy' & ButtonVariants['variant'];
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  class: '',
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot></slot>
  </Primitive>
</template>
