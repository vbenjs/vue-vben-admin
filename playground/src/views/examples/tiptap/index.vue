<script lang="ts" setup>
import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { VbenTiptap, VbenTiptapPreview } from '@vben/plugins/tiptap';

import { Card } from 'ant-design-vue';
const content = ref(`
  <h1>Vben Tiptap</h1>
  <p>这个编辑器已经被封装在 <code>packages/effects/plugins/src/tiptap</code> 中。</p>
  <p>你可以直接在各个 app 里通过 <code>@vben/plugins/tiptap</code> 引入。</p>
  <blockquote>默认内置 StarterKit、Underline、TextAlign、Placeholder。</blockquote>
`);
const previewContent = computed(() => content.value);
</script>

<template>
  <Page title="Tiptap 富文本">
    <template #description>
      <div class="mt-2 text-foreground/80">
        统一封装后的富文本编辑器，适合在各个 app 中直接复用。
      </div>
    </template>

    <Card class="mb-5" title="编辑器">
      <VbenTiptap v-model="content" />
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
