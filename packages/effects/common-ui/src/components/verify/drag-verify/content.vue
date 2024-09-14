<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  isPassing: boolean;
  successText: string;
  text: string;
}>();

const cls = computed(() => {
  return {
    'drag-verify-content': true,
    success: props.isPassing,
  };
});
</script>

<template>
  <div :class="cls">{{ isPassing ? successText : text }}</div>
</template>

<style scoped></style>
