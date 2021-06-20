<template>
  <PageWrapper title="图片裁剪示例" content="需要开启测试接口服务才能进行上传测试！">
    <CollapseContainer title="头像裁剪">
      <CropperAvatar :uploadApi="uploadApi" />
    </CollapseContainer>

    <CollapseContainer title="矩形裁剪" class="my-4">
      <div class="container p-4">
        <div class="cropper-container mr-10">
          <CropperImage ref="refCropper" :src="img" @cropend="handleCropend" style="width: 40vw" />
        </div>
        <img :src="cropperImg" class="croppered" v-if="cropperImg" />
      </div>
      <p v-if="cropperImg">裁剪后图片信息：{{ info }}</p>
    </CollapseContainer>

    <CollapseContainer title="圆形裁剪">
      <div class="container p-4">
        <div class="cropper-container mr-10">
          <CropperImage
            ref="refCropper"
            :src="img"
            @cropend="handleCircleCropend"
            style="width: 40vw"
            circled
          />
        </div>
        <img :src="circleImg" class="croppered" v-if="circleImg" />
      </div>
      <p v-if="circleImg">裁剪后图片信息：{{ circleInfo }}</p>
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { CollapseContainer } from '/@/components/Container/index';
  import { CropperImage, CropperAvatar } from '/@/components/Cropper';
  import { uploadApi } from '/@/api/sys/upload';
  import img from '/@/assets/images/header.jpg';

  export default defineComponent({
    components: {
      PageWrapper,
      CropperImage,
      CollapseContainer,
      CropperAvatar,
    },
    setup() {
      const info = ref('');
      const cropperImg = ref('');
      const circleInfo = ref('');
      const circleImg = ref('');

      function handleCropend({ imgBase64, imgInfo }) {
        info.value = imgInfo;
        cropperImg.value = imgBase64;
      }

      function handleCircleCropend({ imgBase64, imgInfo }) {
        circleInfo.value = imgInfo;
        circleImg.value = imgBase64;
      }

      return {
        img,
        info,
        circleInfo,
        cropperImg,
        circleImg,
        handleCropend,
        handleCircleCropend,
        uploadApi,
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
