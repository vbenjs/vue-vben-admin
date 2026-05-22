<script lang="ts" setup>
import { ref } from 'vue';

import { VbenTiptap } from '@vben/plugins/tiptap';

const content = ref('<p>开始编辑你的内容...</p>');
</script>

<template>
  <div>
    <VbenTiptap v-model="content" />
    <div class="mt-4">
      <p class="text-sm text-gray-500">当前内容:</p>
      <pre
        class="mt-2 max-h-40 overflow-auto rounded-sm bg-gray-100 p-2 text-xs"
      >
        {{ content }}
      </pre>
    </div>
  </div>
</template>
