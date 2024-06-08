<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';

import { ChevronDownIcon } from '@radix-icons/vue';
import {
  SelectScrollDownButton,
  type SelectScrollDownButtonProps,
  useForwardProps,
} from 'radix-vue';

import { cn } from '#/lib/utils';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & SelectScrollDownButtonProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectScrollDownButton
    v-bind="forwardedProps"
    :class="
      cn('flex cursor-default items-center justify-center py-1', props.class)
    "
  >
    <slot>
      <ChevronDownIcon />
    </slot>
  </SelectScrollDownButton>
</template>
