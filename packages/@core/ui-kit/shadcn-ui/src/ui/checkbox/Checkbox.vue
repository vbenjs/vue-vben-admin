<script setup lang="ts">
import type { CheckboxRootEmits, CheckboxRootProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { Check, Minus } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from 'reka-ui';

const props = defineProps<
  CheckboxRootProps & {
    class?: HTMLAttributes['class'];
    indeterminate?: boolean;
  }
>();
const emits = defineEmits<CheckboxRootEmits>();

const delegatedProps = reactiveOmit(props, 'class', 'indeterminate');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <CheckboxRoot
    v-slot="slotProps"
    data-slot="checkbox"
    v-bind="forwarded"
    :class="
      cn(
        'peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        indeterminate && 'bg-primary text-primary-foreground border-primary',
        props.class,
      )
    "
  >
    <CheckboxIndicator
      data-slot="checkbox-indicator"
      class="grid place-content-center text-current transition-none"
      :force-mount="indeterminate ? true : undefined"
    >
      <slot v-bind="slotProps">
        <Minus v-if="indeterminate" class="size-3.5" />
        <Check v-else class="size-3.5" />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
