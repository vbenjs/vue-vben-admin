<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/toolkit';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <div :class="cn('flex flex-col gap-y-1.5 p-6', props.class)">
    <slot></slot>
  </div>
</template>
