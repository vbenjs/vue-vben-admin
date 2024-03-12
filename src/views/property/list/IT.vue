<template>
  <PropertyList :auth="AUTH_KEY" />
</template>
<script lang="ts" setup>
  import PropertyList from './components/PropertyList.vue';

  const AUTH_KEY = 'ITProperty';

  defineOptions({ name: AUTH_KEY });
</script>
