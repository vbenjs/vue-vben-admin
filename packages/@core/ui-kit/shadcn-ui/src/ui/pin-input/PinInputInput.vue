<script setup lang="ts">
import type { PinInputInputProps } from 'reka-ui';

import { computed } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { PinInputInput, useForwardProps } from 'reka-ui';

const props = defineProps<PinInputInputProps & { class?: any }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <PinInputInput
    v-bind="forwardedProps"
    data-slot="pin-input-input"
    :class="
      cn(
        'border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 relative flex size-9 items-center justify-center border-y border-r text-center text-sm shadow-xs outline-none transition-all first:rounded-l-md first:border-l last:rounded-r-md focus:relative focus:z-10 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:size-10',
        props.class,
      )
    "
  />
</template>
