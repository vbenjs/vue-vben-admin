<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';

import { Primitive, type PrimitiveProps } from 'radix-vue';

import { cn } from '#/lib/utils';

const props = withDefaults(
  defineProps<{ class?: HTMLAttributes['class'] } & PrimitiveProps>(),
  {
    as: 'a',
  },
);
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn('hover:text-foreground transition-colors', props.class)"
  >
    <slot></slot>
  </Primitive>
</template>
