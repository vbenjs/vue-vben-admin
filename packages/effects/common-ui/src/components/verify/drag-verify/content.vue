<script setup lang="ts">
defineProps<{
  successText: string;
  text: string;
}>();

const cls = [`darg-verify-content`];
</script>

<template>
  <div :class="cls">123</div>
</template>

<style scoped></style>
