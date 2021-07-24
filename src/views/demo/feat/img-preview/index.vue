<template>
  <PageWrapper title="图片预览示例">
    <ImagePreview :imageList="imgList" />
    <a-button @click="openImg" type="primary">无预览图</a-button>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { createImgPreview, ImagePreview } from '/@/components/Preview/index';
  import { PageWrapper } from '/@/components/Page';

  const imgList: string[] = [
    'https://picsum.photos/id/66/346/216',
    'https://picsum.photos/id/67/346/216',
    'https://picsum.photos/id/68/346/216',
  ];
  export default defineComponent({
    components: { PageWrapper, ImagePreview },
    setup() {
      function openImg() {
        createImgPreview({ imageList: imgList });
      }
      return { imgList, openImg };
    },
  });
</script>
