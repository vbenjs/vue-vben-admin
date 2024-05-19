<script lang="ts" setup>
import { onMounted } from 'vue';

defineOptions({ name: 'Menu1' });

onMounted(() => {
  // eslint-disable-next-line no-console
  console.log('Menu1');
});
</script>
<template>
  <div class="p-5">
    menu1
    <input class="bg-background border-border" />
  </div>
</template>
