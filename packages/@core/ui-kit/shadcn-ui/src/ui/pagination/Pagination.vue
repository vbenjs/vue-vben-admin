<script setup lang="ts">
import type { PaginationRootEmits, PaginationRootProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { reactiveOmit } from '@vueuse/core';
import { PaginationRoot, useForwardPropsEmits } from 'reka-ui';

const props = defineProps<
  PaginationRootProps & {
    class?: HTMLAttributes['class'];
  }
>();
const emits = defineEmits<PaginationRootEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <PaginationRoot
    v-slot="slotProps"
    data-slot="pagination"
    v-bind="forwarded"
    :class="cn('mx-auto flex w-full justify-center', props.class)"
  >
    <slot v-bind="slotProps"></slot>
  </PaginationRoot>
</template>
