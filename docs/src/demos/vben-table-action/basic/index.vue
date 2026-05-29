<script lang="ts" setup>
import type { ActionItem } from '@vben/common-ui';

import { ref } from 'vue';

import { VbenTableAction } from '@vben/common-ui';

const last = ref('无');

const actions: ActionItem[] = [
  { key: 'edit', onClick: () => (last.value = '编辑'), text: '编辑' },
  { key: 'detail', onClick: () => (last.value = '详情'), text: '详情' },
  {
    danger: true,
    key: 'delete',
    onClick: () => (last.value = '删除'),
    text: '删除',
  },
];
</script>
<template>
  <div>
    <VbenTableAction :actions="actions" align="start" divider />
    <p style="margin-top: 8px; font-size: 13px; opacity: 0.7">
      最近点击：{{ last }}
    </p>
  </div>
</template>
