<script setup lang="ts">
import type { PageHeaderProps } from './page.ts';

defineOptions({
  name: 'PageHeader',
});

const props = defineProps<PageHeaderProps>();
</script>

<template>
  <div class="bg-card px-6 py-4">
    <div class="mb-2 flex justify-between text-xl font-bold leading-10">
      {{ props.title }}
    </div>
    <slot></slot>
  </div>
</template>
