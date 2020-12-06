<template>
  <span class="thumb">
    <img v-if="fileUrl" :src="fileUrl" />
  </span>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    props: {
      fileUrl: propTypes.string.def(''),
      fileName: propTypes.string.def(''),
    },
  });
</script>
<style lang="less" scoped>
  .thumb {
    img {
      position: static;
      display: block;
      width: 104px;
      height: 104px;
      object-fit: cover;
    }
  }
</style>
