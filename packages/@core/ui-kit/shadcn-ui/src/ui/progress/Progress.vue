<script setup lang="ts">
import type { ProgressRootEmits, ProgressRootProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { computed } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { reactiveOmit } from '@vueuse/core';
import { ProgressIndicator, ProgressRoot, useForwardPropsEmits } from 'reka-ui';

const props = defineProps<
  ProgressRootProps & { class?: HTMLAttributes['class'] }
>();

const emits = defineEmits<ProgressRootEmits>();

/** ProgressRoot 对非法 max 的回退值（max 必须为正数）。 */
const DEFAULT_MAX = 100;

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);

/**
 * ProgressRoot 会把非法 max（0、负数、NaN）回退为 100；这里用同一规则
 * 归一化后同时用于 root 与指示条 transform，避免 max=0 产生无穷百分比。
 */
const normalizedMax = computed(() => {
  const { max } = props;
  return typeof max === 'number' && !Number.isNaN(max) && max > 0
    ? max
    : DEFAULT_MAX;
});
</script>

<template>
  <ProgressRoot
    v-slot="slotProps"
    data-slot="progress"
    v-bind="forwarded"
    :max="normalizedMax"
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
      :style="`transform: translateX(-${100 - ((slotProps.modelValue || 0) / normalizedMax) * 100}%)`"
    />
  </ProgressRoot>
</template>
