<script setup lang="ts">
import type { SplitterGroupEmits, SplitterGroupProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { reactiveOmit } from '@vueuse/core';
import { SplitterGroup, useForwardPropsEmits } from 'reka-ui';

const props = defineProps<
  SplitterGroupProps & { class?: HTMLAttributes['class'] }
>();
const emits = defineEmits<SplitterGroupEmits>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <SplitterGroup
    v-slot="slotProps"
    data-slot="resizable-panel-group"
    v-bind="forwarded"
    :class="
      cn('flex h-full w-full data-[orientation=vertical]:flex-col', props.class)
    "
  >
    <slot v-bind="slotProps"></slot>
  </SplitterGroup>
</template>
