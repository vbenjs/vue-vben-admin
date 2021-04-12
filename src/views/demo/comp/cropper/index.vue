<template>
  <PageWrapper title="图片裁剪示例" contentBackground>
    <div class="cropper-container">
      <CropperImage
        ref="refCropper"
        src="https://fengyuanchen.github.io/cropperjs/images/picture.jpg"
        @cropperedInfo="cropperedInfo"
        style="width: 40%"
      />
      <a-button type="primary" @click="onCropper"> 裁剪 </a-button>
      <img :src="cropperImg" class="croppered" v-if="cropperImg" />
    </div>
    <p v-if="cropperImg">裁剪后图片信息：{{ info }}</p>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, onBeforeMount, getCurrentInstance } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { CropperImage } from '/@/components/Cropper';
  import img from '/@/assets/images/header.jpg';
  export default defineComponent({
    components: {
      PageWrapper,
      CropperImage,
    },
    setup() {
      let vm: any;
      let info = ref('');
      let cropperImg = ref('');

      const onCropper = (): void => {
        vm.refs.refCropper.croppered();
      };

      onBeforeMount(() => {
        vm = getCurrentInstance();
      });

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
  .cropper-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .croppered {
    width: 50%;
    height: 100%;
  }
</style>
