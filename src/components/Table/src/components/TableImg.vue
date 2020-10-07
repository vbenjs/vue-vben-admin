<template>
  <div class="basic-table-img__preview" v-if="imgList && imgList.length">
    <template v-for="(img, index) in imgList" :key="img">
      <img :width="size" @click="handlePreview(index)" :src="img" />
    </template>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { createImgPreview } from '/@/components/Preview/index';

  export default defineComponent({
    name: 'TableAction',
    props: {
      imgList: {
        type: Array as PropType<string[]>,
        default: null,
      },
      size: {
        type: Number as PropType<number>,
        default: 40,
      },
    },
    setup(props) {
      function handlePreview(index: number) {
        const { imgList } = props;

        createImgPreview({
          imageList: imgList as string[],
          index: index,
        });
      }
      return { handlePreview };
    },
  });
</script>
