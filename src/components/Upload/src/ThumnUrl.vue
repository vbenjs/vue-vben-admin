<template>
  <span>
    <img v-if="fileUrl" :src="fileUrl" />
    <span v-else>{{ fileType }}</span>
  </span>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      fileUrl: {
        type: String,
        default: '',
      },
      fileType: {
        type: String,
        default: '',
      },
      fileName: {
        type: String,
        default: '',
      },
    },
    setup() {
      return {};
    },
  });
</script>
