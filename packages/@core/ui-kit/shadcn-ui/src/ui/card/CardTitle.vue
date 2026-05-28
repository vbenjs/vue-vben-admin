<script setup lang="ts">
import { cn } from '@vben-core/shared/utils';

const props = defineProps<{
  class?: any;
}>();
</script>

<template>
  <h3
    data-slot="card-title"
    :class="cn('leading-none font-semibold', props.class)"
  >
    <slot></slot>
  </h3>
</template>
