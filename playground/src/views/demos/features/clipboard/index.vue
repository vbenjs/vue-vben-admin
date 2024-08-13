<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { useClipboard } from '@vueuse/core';
import { Button, Input } from 'ant-design-vue';

const source = ref('Hello');
const { copy, text } = useClipboard({ source });
</script>

<template>
  <Page title="剪切板示例">
    <p class="mb-3">
      Current copied: <code>{{ text || 'none' }}</code>
    </p>
    <Input.Group class="flex">
      <Input v-model:value="source" placeholder="请输入" />
      <Button type="primary" @click="copy(source)"> Copy </Button>
    </Input.Group>
  </Page>
</template>
