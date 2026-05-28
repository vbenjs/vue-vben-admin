<script setup lang="ts">
import { cn } from '@vben-core/shared/utils';

const props = defineProps<{
  class?: any;
}>();
</script>

<template>
  <div data-slot="card-content" :class="cn('px-6', props.class)">
    <slot></slot>
  </div>
</template>
