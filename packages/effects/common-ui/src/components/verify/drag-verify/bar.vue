<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  toLeft: boolean;
}>();
const cls = computed(() => {
  return {
    'drag-verify-bar': true,
    'to-left': props.toLeft,
  };
});
</script>

<template>
  <div :class="cls"></div>
</template>

<style scoped></style>
