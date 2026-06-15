<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import type { ButtonVariants } from './button';

import { cn } from '@vben-core/shared/utils';

import { Primitive } from 'reka-ui';

import { buttonVariants } from './button';

interface Props extends PrimitiveProps {
  class?: HTMLAttributes['class'];
  size?: ButtonVariants['size'];
  variant?: ButtonVariants['variant'];
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
});
</script>

<template>
  <Primitive
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot></slot>
  </Primitive>
</template>
