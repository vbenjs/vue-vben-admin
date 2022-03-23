<template>
  <div class="relative">
    <LayoutHeader />
    <LayoutContent />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import LayoutHeader from './header/index.vue';
  import LayoutContent from './content/index.vue';

  export default defineComponent({
    name: 'SimpleLayout',
    components: {
      LayoutHeader,
      LayoutContent,
    },
  });
</script>

<style></style>
