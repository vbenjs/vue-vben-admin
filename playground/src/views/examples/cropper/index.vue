<script lang="ts" setup>
import type { UploadChangeParam } from 'ant-design-vue';

import { ref } from 'vue';

import { Page, VCropper } from '@vben/common-ui';

import { Button, Card, Select, Upload } from 'ant-design-vue';

const options = [
  { label: '1:1', value: '1:1' },
  { label: '16:9', value: '16:9' },
  { label: '不限制', value: '' },
];

const cropperRef = ref<InstanceType<typeof VCropper>>();

const cropLoading = ref(false);
const validAspectRatio = ref<string | undefined>('1:1');
const imgUrl = ref('');
const cropperImg = ref();

const selectImgFile = (event: UploadChangeParam) => {
  const file = event.fileList[0]?.originFileObj;
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    console.error('请上传图片文件');
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', (e) => {
    imgUrl.value = e.target?.result as string;
  });
  reader.addEventListener('error', () => {
    console.error('Failed to read file');
  });

  reader.readAsDataURL(file);
};

const cropImage = async () => {
  if (!cropperRef.value) return;
  cropLoading.value = true;
  try {
    cropperImg.value = await cropperRef.value.getCropImage();
  } catch (error) {
    console.error('图片裁剪失败:', error);
  } finally {
    cropLoading.value = false;
  }
};

/**
 * 下载图片
 */
const downloadImage = () => {
  if (!cropperImg.value) return;

  const link = document.createElement('a');
  link.download = `cropped-image-${Date.now()}.png`;
  link.href = cropperImg.value;
  link.click();
};
</script>
<template>
  <Page
    title="VCropper 图片裁剪"
    description="VCropper是一个图片裁剪组件，提供基础的图片裁剪功能。"
  >
    <Card>
      <div class="image-cropper-container">
        <div class="cropper-ratio-display">
          <label class="ratio-label">当前裁剪比例：</label>
          <Select
            class="w-24"
            v-model:value="validAspectRatio"
            :options="options"
          />
          <Upload
            :max-count="1"
            :show-upload-list="false"
            :before-upload="() => false"
            @change="selectImgFile"
          >
            <Button>上传图片</Button>
          </Upload>
        </div>

        <div v-if="imgUrl" class="cropper-main-wrapper">
          <VCropper
            ref="cropperRef"
            :img="imgUrl"
            :aspect-ratio="validAspectRatio"
            :width="600"
            :height="600"
          />

          <!-- 操作按钮组 -->
          <div class="cropper-btn-group">
            <Button :loading="cropLoading" @click="cropImage" type="primary">
              裁剪
            </Button>
            <Button v-if="cropperImg" @click="downloadImage" danger>
              下载图片
            </Button>
          </div>

          <!-- 裁剪预览 -->
          <img
            v-if="cropperImg"
            class="h-full w-80"
            :src="cropperImg"
            alt="裁剪预览"
          />
        </div>
      </div>
    </Card>
  </Page>
</template>
<style scoped>
/* 比例展示区域 */
.cropper-ratio-display {
  @apply my-2.5 flex items-center justify-start gap-4;
}

.ratio-label {
  @apply text-sm font-medium;
}
/* 主裁剪区域 */
.cropper-main-wrapper {
  @apply flex items-center gap-4;
}
.cropper-btn-group {
  @apply flex flex-col gap-2;
}
</style>
