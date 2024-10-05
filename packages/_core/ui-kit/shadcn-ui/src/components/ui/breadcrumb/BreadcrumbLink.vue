<script lang="ts" setup>
import { cn } from '@vben-core/shared/utils';

import { Primitive, type PrimitiveProps } from 'radix-vue';

const props = withDefaults(defineProps<{ class?: any } & PrimitiveProps>(), {
  as: 'a',
});
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
