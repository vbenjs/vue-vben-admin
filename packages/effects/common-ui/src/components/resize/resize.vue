<script setup lang="ts">
interface Props {
  w?: string;
  h?: string;
}

withDefaults(defineProps<Props>(), {
  w: '300px',
  h: '100%',
});
</script>

<template>
  <div>
    <slot></slot>
  </div>
</template>

<style scoped></style>
