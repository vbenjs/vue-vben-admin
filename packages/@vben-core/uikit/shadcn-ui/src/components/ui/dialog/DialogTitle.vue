<script setup lang="ts">
import { cn } from '#/lib/utils';
import { DialogTitle, type DialogTitleProps, useForwardProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & DialogTitleProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <DialogTitle
    v-bind="forwardedProps"
    :class="
      cn('text-lg font-semibold leading-none tracking-tight', props.class)
    "
  >
    <slot></slot>
  </DialogTitle>
</template>
