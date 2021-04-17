<template>
  <PageWrapper title="图片裁剪示例" contentBackground>
    <div class="container">
      <div class="cropper-container">
        <CropperImage
          ref="refCropper"
          src="https://fengyuanchen.github.io/cropperjs/images/picture.jpg"
          @cropperedInfo="cropperedInfo"
          style="width: 40vw"
        />
      </div>
      <a-button type="primary" @click="onCropper"> 裁剪 </a-button>
      <img :src="cropperImg" class="croppered" v-if="cropperImg" />
    </div>
    <p v-if="cropperImg">裁剪后图片信息：{{ info }}</p>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { CropperImage } from '/@/components/Cropper';
  import img from '/@/assets/images/header.jpg';
  import { templateRef } from '@vueuse/core';

  export default defineComponent({
    components: {
      PageWrapper,
      CropperImage,
    },
    setup() {
      let info = ref('');
      let cropperImg = ref('');
      const refCropper = templateRef<HTMLElement | null>('refCropper', null);

      const onCropper = (): void => {
        unref(refCropper).croppered();
      };

      function cropperedInfo({ imgBase64, imgInfo }) {
        info.value = imgInfo;
        cropperImg.value = imgBase64;
      }

      return {
        img,
        info,
        cropperImg,
        onCropper,
        cropperedInfo,
      };
    },
  });
</script>

<style scoped>
  .container {
    display: flex;
    width: 100vw;
    align-items: center;
  }

  .cropper-container {
    width: 40vw;
  }

  .croppered {
    height: 360px;
  }

  p {
    margin: 10px;
  }
</style>
