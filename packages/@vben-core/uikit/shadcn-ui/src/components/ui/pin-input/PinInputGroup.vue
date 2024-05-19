<script setup lang="ts">
import { cn } from '#/lib/utils';
import { Primitive, type PrimitiveProps, useForwardProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

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
