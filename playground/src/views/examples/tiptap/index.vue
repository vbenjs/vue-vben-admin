<script lang="ts" setup>
import type { ImageUploadOptions } from '@vben/plugins/tiptap';

import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { VbenTiptap, VbenTiptapPreview } from '@vben/plugins/tiptap';

import { Card, Switch } from 'ant-design-vue';
const content = ref(`
  <h1>Vben Tiptap</h1>
  <p>这个编辑器已经被封装在 <code>packages/effects/plugins/src/tiptap</code> 中。</p>
  <p>你可以直接在各个 app 里通过 <code>@vben/plugins/tiptap</code> 引入。</p>
  <blockquote>默认内置 StarterKit、Underline、TextAlign、Placeholder。</blockquote>
`);
const previewContent = computed(() => content.value);

const enableUpload = ref(true);

// Mock upload: 模拟上传延迟，支持进度回调
const imageUpload: ImageUploadOptions = {
  accept: 'image/*',
  maxSize: 5 * 1024 * 1024, // 5MB
  upload: (file, onProgress) =>
    new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        onProgress?.(Math.round(progress));
        if (progress >= 100) {
          // 上传完成后返回 mock URL
          resolve(
            `https://picsum.photos/seed/${Date.now()}/640/${Math.round((640 * ((file.size % 3) + 2)) / 4)}`,
          );
        }
      }, 300);
    }),
  onUploadError: (error) => {
    console.error('Image upload failed:', error);
  },
};
</script>

<template>
  <Page title="Tiptap 富文本">
    <template #description>
      <div class="mt-2 text-foreground/80">
        统一封装后的富文本编辑器，适合在各个 app 中直接复用。
      </div>
    </template>

    <Card class="mb-5" title="编辑器">
      <div class="mb-3 flex items-center gap-3">
        <span class="text-sm">启用图片上传：</span>
        <Switch v-model:checked="enableUpload" />
      </div>
      <VbenTiptap
        v-model="content"
        :image-upload="enableUpload ? imageUpload : undefined"
      />
    </Card>

    <Card class="mb-5" title="富文本预览">
      <VbenTiptapPreview :content="previewContent" />
    </Card>

    <Card title="HTML 输出">
      <pre class="overflow-auto rounded-xl border border-border bg-muted p-4">
        {{ previewContent }}
      </pre>
    </Card>
  </Page>
</template>
