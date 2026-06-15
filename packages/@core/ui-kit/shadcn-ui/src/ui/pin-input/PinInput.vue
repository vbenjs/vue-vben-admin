<script setup lang="ts" generic="Type extends 'text' | 'number' = 'text'">
import type { PinInputRootEmits, PinInputRootProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { reactiveOmit } from '@vueuse/core';
import { PinInputRoot, useForwardPropsEmits } from 'reka-ui';

const props = withDefaults(
  defineProps<PinInputRootProps<Type> & { class?: HTMLAttributes['class'] }>(),
  {
    otp: true,
  },
);
const emits = defineEmits<PinInputRootEmits<Type>>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <PinInputRoot
    :otp="props.otp"
    data-slot="pin-input"
    v-bind="forwarded"
    :class="
      cn(
        'flex items-center gap-2 has-disabled:opacity-50 disabled:cursor-not-allowed',
        props.class,
      )
    "
  >
    <slot></slot>
  </PinInputRoot>
</template>
