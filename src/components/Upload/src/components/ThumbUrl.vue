<template>
  <span class="thumb">
    <Image v-if="fileUrl" :src="fileUrl" :width="104" />
  </span>
</template>
<script lang="ts" setup>
  import { propTypes } from '@/utils/propTypes';
  import { Image } from 'ant-design-vue';

  defineProps({
    fileUrl: propTypes.string.def(''),
    fileName: propTypes.string.def(''),
  });
</script>
<style lang="less">
  .thumb {
    img {
      display: block;
      position: static;
      border-radius: 4px;
      cursor: zoom-in;
      object-fit: cover;
    }
  }
</style>
