<script setup lang="ts">
defineOptions({
  name: 'PageFooter',
});
</script>

<template>
  <div
    class="bg-card align-center absolute bottom-0 left-0 right-0 flex px-6 py-4"
  >
    <slot></slot>
  </div>
</template>
