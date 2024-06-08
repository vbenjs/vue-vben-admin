<script lang="ts" setup>
import { onMounted } from 'vue';

defineOptions({ name: 'Menu2' });

onMounted(() => {
  // eslint-disable-next-line no-console
  console.log('Menu2');
});
</script>
<template>
  <div class="p-5">
    menu2
    <input class="bg-background border-border" />
  </div>
</template>
