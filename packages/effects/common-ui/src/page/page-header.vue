<script setup lang="ts">
import type { PageHeaderProps } from './page.ts';

defineOptions({
  name: 'PageHeader',
});

const props = defineProps<PageHeaderProps>();
</script>

<template>
  <div class="bg-card px-6 py-4">
    <div class="flex justify-between text-lg font-bold">
      {{ props.title }}
    </div>
    <div class="pt-3">
      <slot></slot>
    </div>
  </div>
</template>
