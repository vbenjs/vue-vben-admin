<template>
  <span class="thumb">
    <Image v-if="fileUrl" :src="fileUrl" :width="104" />
  </span>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Image } from 'ant-design-vue'

export default defineComponent({
  components: { Image },
  props: {
    fileUrl: { type: String, default: '' },
    fileName: { type: String, default: '' },
  },
})
</script>
<style lang="less">
.thumb {
  img {
    position: static;
    display: block;
    cursor: zoom-in;
    border-radius: 4px;
    object-fit: cover;
  }
}
</style>
