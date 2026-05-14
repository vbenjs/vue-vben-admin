<script lang="ts" setup>
import { ref } from 'vue';

import { type ImageUploadOptions, VbenTiptap } from '@vben/plugins/tiptap';

const content = ref('');

// Mock upload function with progress simulation
const imageUpload: ImageUploadOptions = {
  accept: 'image/jpeg,image/png,image/gif,image/webp',
  maxSize: 5 * 1024 * 1024, // 5MB
  upload: async (_file, onProgress) => {
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      onProgress?.(i);
    }

    // Return a mock image URL (using picsum for demo)
    return `https://picsum.photos/seed/${Date.now()}/800/400`;
  },
  onUploadError: (error) => {
    console.error('Upload error:', error);
  },
};
</script>

<template>
  <div>
    <VbenTiptap
      v-model="content"
      :image-upload="imageUpload"
      placeholder="尝试拖拽或粘贴图片..."
    />
    <div class="mt-4">
      <p class="text-sm text-gray-500">提示:</p>
      <ul class="mt-2 text-xs text-gray-400 list-disc pl-4">
        <li>点击工具栏图片按钮可选择本地上传或 URL 插入</li>
        <li>拖拽图片到编辑器区域可直接上传</li>
        <li>粘贴图片也会触发上传</li>
        <li>上传过程中会显示进度条</li>
      </ul>
    </div>
  </div>
</template>
