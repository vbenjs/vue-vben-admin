<script setup lang="ts">
import type { CheckboxRootEmits, CheckboxRootProps } from 'radix-vue';

import { computed, type HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared';

import { CheckIcon } from '@radix-icons/vue';
import {
  CheckboxIndicator,
  CheckboxRoot,
  useForwardPropsEmits,
} from 'radix-vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & CheckboxRootProps
>();
const emits = defineEmits<CheckboxRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <CheckboxRoot
    v-bind="forwarded"
    :class="
      cn(
        'focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-border peer h-4 w-4 shrink-0 rounded-sm border focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    "
  >
    <CheckboxIndicator
      class="flex h-full w-full items-center justify-center text-current"
    >
      <slot>
        <CheckIcon class="h-4 w-4" />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
