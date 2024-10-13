<script setup lang="ts">
import { cn } from '@vben-core/shared/utils';

import { SelectLabel, type SelectLabelProps } from 'radix-vue';

const props = defineProps<{ class?: any } & SelectLabelProps>();
</script>

<template>
  <SelectLabel :class="cn('px-2 py-1.5 text-sm font-semibold', props.class)">
    <slot></slot>
  </SelectLabel>
</template>
