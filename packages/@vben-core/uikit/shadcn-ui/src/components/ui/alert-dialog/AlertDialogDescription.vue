<script setup lang="ts">
import { cn } from '#/lib/utils';
import {
  AlertDialogDescription,
  type AlertDialogDescriptionProps,
} from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & AlertDialogDescriptionProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <AlertDialogDescription
    v-bind="delegatedProps"
    :class="cn('text-muted-foreground text-sm', props.class)"
  >
    <slot></slot>
  </AlertDialogDescription>
</template>
