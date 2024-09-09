<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared';

import { SelectLabel, type SelectLabelProps } from 'radix-vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & SelectLabelProps
>();
</script>

<template>
  <SelectLabel :class="cn('px-2 py-1.5 text-sm font-semibold', props.class)">
    <slot></slot>
  </SelectLabel>
</template>
