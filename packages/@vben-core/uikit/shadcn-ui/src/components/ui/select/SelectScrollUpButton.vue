<script setup lang="ts">
import { cn } from '#/lib/utils';
import { ChevronUpIcon } from '@radix-icons/vue';
import {
  SelectScrollUpButton,
  type SelectScrollUpButtonProps,
  useForwardProps,
} from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & SelectScrollUpButtonProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectScrollUpButton
    v-bind="forwardedProps"
    :class="
      cn('flex cursor-default items-center justify-center py-1', props.class)
    "
  >
    <slot>
      <ChevronUpIcon />
    </slot>
  </SelectScrollUpButton>
</template>
