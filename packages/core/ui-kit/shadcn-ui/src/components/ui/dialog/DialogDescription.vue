<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared';

import {
  DialogDescription,
  type DialogDescriptionProps,
  useForwardProps,
} from 'radix-vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & DialogDescriptionProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <DialogDescription
    v-bind="forwardedProps"
    :class="cn('text-muted-foreground text-sm', props.class)"
  >
    <slot></slot>
  </DialogDescription>
</template>
