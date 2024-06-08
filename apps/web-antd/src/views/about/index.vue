<script lang="ts" setup>
import { onMounted } from 'vue';

defineOptions({ name: 'About' });
onMounted(() => {
  // eslint-disable-next-line no-console
  console.log('About');
});
</script>

<template>
  <div>
    about
    <input class="bg-background border-border" />
  </div>
</template>
