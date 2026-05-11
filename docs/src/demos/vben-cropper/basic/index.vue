<script lang="ts" setup>
import { onBeforeUnmount, ref } from 'vue';

import { VCropper } from '@vben/common-ui';

const cropperRef = ref<InstanceType<typeof VCropper>>();
const imageUrl = ref('https://picsum.photos/seed/cropper-demo/800/600');
const croppedImage = ref('');

// 释放旧的 object URL 以避免内存泄漏
const revokeCroppedImage = () => {
  if (croppedImage.value?.startsWith('blob:')) {
    URL.revokeObjectURL(croppedImage.value);
  }
};

const handleCrop = async () => {
  const blob = await cropperRef.value?.getCropImage('image/jpeg', 0.9, 'blob');
  if (blob instanceof Blob) {
    // 释放旧的 URL
    revokeCroppedImage();
    croppedImage.value = URL.createObjectURL(blob);
  }
};

const handleReset = () => {
  // 释放 URL
  revokeCroppedImage();
  croppedImage.value = '';
  // 重新加载图片以重置裁剪框
  imageUrl.value = `https://picsum.photos/seed/cropper-${Date.now()}/800/600`;
};

// 组件卸载时清理
onBeforeUnmount(() => {
  revokeCroppedImage();
});
</script>

<template>
  <div>
    <VCropper ref="cropperRef" :img="imageUrl" :width="500" :height="300" />
    <div class="mt-4 flex gap-2">
      <button
        class="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
        @click="handleCrop"
      >
        裁剪图片
      </button>
      <button
        class="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600"
        @click="handleReset"
      >
        重置
      </button>
    </div>
    <div v-if="croppedImage" class="mt-4">
      <p class="text-sm text-gray-500 mb-2">裁剪结果:</p>
      <img :src="croppedImage" class="max-w-full rounded border" />
    </div>
    <div class="mt-4">
      <p class="text-sm text-gray-500">提示:</p>
      <ul class="mt-2 text-xs text-gray-400 list-disc pl-4">
        <li>拖拽裁剪框中心区域可移动裁剪位置</li>
        <li>拖拽四角或四边可调整裁剪框大小</li>
        <li>默认为自由比例，可调整为任意比例</li>
      </ul>
    </div>
  </div>
</template>
