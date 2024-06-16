<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';

import { cn } from '@vben-core/toolkit';

import { Primitive, type PrimitiveProps, useForwardProps } from 'radix-vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & PrimitiveProps
>();
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <Primitive
    v-bind="forwardedProps"
    :class="cn('flex items-center', props.class)"
  >
    <slot></slot>
  </Primitive>
</template>
