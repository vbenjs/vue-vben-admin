<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui';

import type { BadgeVariants } from './badge';

import { cn } from '@vben-core/shared/utils';

import { Primitive } from 'reka-ui';

import { badgeVariants } from './badge';

interface Props extends PrimitiveProps {
  class?: any;
  variant?: BadgeVariants['variant'];
}

const props = withDefaults(defineProps<Props>(), {
  as: 'span',
  variant: 'default',
});
</script>

<template>
  <Primitive
    data-slot="badge"
    :as="as"
    :as-child="asChild"
    :data-variant="variant"
    :class="cn(badgeVariants({ variant }), props.class)"
  >
    <slot></slot>
  </Primitive>
</template>
