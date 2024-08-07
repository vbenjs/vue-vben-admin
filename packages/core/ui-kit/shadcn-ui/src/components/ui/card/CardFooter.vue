<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <div :class="cn('flex items-center p-6 pt-0', props.class)">
    <slot></slot>
  </div>
</template>
