<template>
  <span>
    <img v-if="fileUrl" :src="fileUrl" />
    <span v-else>{{ fileType }}</span>
  </span>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';

  export default defineComponent({
    props: {
      fileUrl: {
        type: String as PropType<string>,
        default: '',
      },
      fileType: {
        type: String as PropType<string>,
        default: '',
      },
      fileName: {
        type: String as PropType<string>,
        default: '',
      },
    },
  });
</script>
