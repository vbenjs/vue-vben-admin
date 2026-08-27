<script setup lang="ts">
import type { ProgressRootEmits, ProgressRootProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { reactiveOmit } from '@vueuse/core';
import { ProgressIndicator, ProgressRoot, useForwardPropsEmits } from 'reka-ui';

const props = defineProps<
  ProgressRootProps & { class?: HTMLAttributes['class'] }
>();

const emits = defineEmits<ProgressRootEmits>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <ProgressRoot
    v-slot="slotProps"
    data-slot="progress"
    v-bind="forwarded"
    :class="
      cn(
        'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
        props.class,
      )
    "
  >
    <ProgressIndicator
      data-slot="progress-indicator"
      :class="cn('bg-primary h-full w-full flex-1 transition-all')"
      :style="`transform: translateX(-${100 - (slotProps.modelValue || 0)}%)`"
    />
  </ProgressRoot>
</template>
