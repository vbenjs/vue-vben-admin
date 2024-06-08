<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { SelectLabel, type SelectLabelProps } from 'radix-vue';

import { cn } from '#/lib/utils';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & SelectLabelProps
>();
</script>

<template>
  <SelectLabel :class="cn('px-2 py-1.5 text-sm font-semibold', props.class)">
    <slot></slot>
  </SelectLabel>
</template>
