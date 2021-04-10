<template>
  <span :class="$attrs.class">
    <g-icon :icon="icon" />
  </span>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    props: {
      icon: String,
    },
  });
</script>
