<script setup lang="ts">
import type { NumberFieldDecrementProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { Minus } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { NumberFieldDecrement, useForwardProps } from 'reka-ui';

const props = defineProps<
  NumberFieldDecrementProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <NumberFieldDecrement
    data-slot="decrement"
    v-bind="forwarded"
    :class="
      cn(
        'absolute top-1/2 -translate-y-1/2 left-0 p-3 disabled:cursor-not-allowed disabled:opacity-20',
        props.class,
      )
    "
  >
    <slot>
      <Minus class="size-4" />
    </slot>
  </NumberFieldDecrement>
</template>
