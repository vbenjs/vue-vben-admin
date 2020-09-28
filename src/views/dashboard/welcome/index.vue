<template>
  <div class="h-full w-full flex justify-center items-center">
    <House />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import House from '../house/index.vue';
  export default defineComponent({
    name: 'Welcome',
    components: { House },
    setup() {
      return {};
    },
  });
</script>
