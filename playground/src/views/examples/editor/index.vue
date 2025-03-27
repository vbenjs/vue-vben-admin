<script setup lang="ts">
import { useAiEditor } from '@vben/plugins/aieditor';

const [VbenAiEditor] = useAiEditor({
  width: '800px',
});
</script>

<template>
  <div>
    <VbenAiEditor />
  </div>
</template>

<style scoped></style>
