<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/toolkit';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <div
    :class="
      cn('bg-card text-card-foreground rounded-xl border shadow', props.class)
    "
  >
    <slot></slot>
  </div>
</template>
