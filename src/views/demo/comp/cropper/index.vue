<template>
  <PageWrapper title="图片裁剪示例" contentBackground>
    <CropperImage src="https://fengyuanchen.github.io/cropperjs/images/picture.jpg"></CropperImage>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';

  import { CropperImage } from '/@/components/Cropper';

  import img from '/@/assets/images/header.jpg';
  export default defineComponent({
    components: {
      PageWrapper,
      CropperImage,
    },
    setup() {
      return { img };
    },
  });
</script>
