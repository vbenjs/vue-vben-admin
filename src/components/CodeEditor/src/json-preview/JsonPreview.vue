<template>
  <vue-json-pretty :path="'res'" :deep="3" :showLength="true" :data="data" />
</template>

<script lang="ts">
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'JsonPreview',
    components: {
      VueJsonPretty,
    },
    props: {
      data: Object,
    },
  });
</script>
