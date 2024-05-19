<script setup lang="ts">
import { cn } from '#/lib/utils';
import {
  DialogDescription,
  type DialogDescriptionProps,
  useForwardProps,
} from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

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
