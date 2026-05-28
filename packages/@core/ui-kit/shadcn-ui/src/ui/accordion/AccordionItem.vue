<script setup lang="ts">
import type { AccordionItemProps } from 'reka-ui';

import { computed } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { AccordionItem, useForwardProps } from 'reka-ui';

const props = defineProps<AccordionItemProps & { class?: any }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <AccordionItem
    v-bind="forwardedProps"
    data-slot="accordion-item"
    :class="cn('border-b last:border-b-0', props.class)"
  >
    <slot></slot>
  </AccordionItem>
</template>
