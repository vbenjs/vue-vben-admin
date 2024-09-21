<script setup lang="ts">
import { computed } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { ChevronDownIcon } from '@radix-icons/vue';
import {
  AccordionHeader,
  AccordionTrigger,
  type AccordionTriggerProps,
} from 'radix-vue';

const props = defineProps<{ class?: any } & AccordionTriggerProps>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <AccordionHeader class="flex">
    <AccordionTrigger
      v-bind="delegatedProps"
      :class="
        cn(
          'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
          props.class,
        )
      "
    >
      <slot></slot>
      <slot name="icon">
        <ChevronDownIcon
          class="text-muted-foreground h-4 w-4 shrink-0 transition-transform duration-200"
        />
      </slot>
    </AccordionTrigger>
  </AccordionHeader>
</template>
