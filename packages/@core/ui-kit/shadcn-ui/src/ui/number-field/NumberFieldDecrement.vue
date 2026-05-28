<script setup lang="ts">
import type { NumberFieldDecrementProps } from 'reka-ui';

import { computed } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { Minus } from 'lucide-vue-next';
import { NumberFieldDecrement, useForwardProps } from 'reka-ui';

const props = defineProps<NumberFieldDecrementProps & { class?: any }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <NumberFieldDecrement
    data-slot="decrement"
    v-bind="forwarded"
    :class="
      cn(
        'text-muted-foreground hover:text-foreground absolute top-1/2 left-0 -translate-y-1/2 rounded-md p-3 transition-colors disabled:cursor-not-allowed disabled:opacity-20',
        props.class,
      )
    "
  >
    <slot>
      <Minus class="size-4" />
    </slot>
  </NumberFieldDecrement>
</template>
