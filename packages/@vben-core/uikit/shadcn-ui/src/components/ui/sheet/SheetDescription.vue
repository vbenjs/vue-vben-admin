<script setup lang="ts">
import { cn } from '#/lib/utils';
import { DialogDescription, type DialogDescriptionProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & DialogDescriptionProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <DialogDescription
    :class="cn('text-muted-foreground text-sm', props.class)"
    v-bind="delegatedProps"
  >
    <slot></slot>
  </DialogDescription>
</template>
