<script setup lang="ts">
import type { SelectScrollUpButtonProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { ChevronUp } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { SelectScrollUpButton, useForwardProps } from 'reka-ui';

const props = defineProps<
  SelectScrollUpButtonProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectScrollUpButton
    data-slot="select-scroll-up-button"
    v-bind="forwardedProps"
    :class="
      cn('flex cursor-default items-center justify-center py-1', props.class)
    "
  >
    <slot>
      <ChevronUp class="size-4" />
    </slot>
  </SelectScrollUpButton>
</template>
