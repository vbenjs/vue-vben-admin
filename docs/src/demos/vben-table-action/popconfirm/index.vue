<script lang="ts" setup>
import type { ActionItem } from '@vben/common-ui';

import { ref } from 'vue';

import { VbenTableAction } from '@vben/common-ui';

const last = ref('无');

const actions: ActionItem[] = [
  { key: 'edit', onClick: () => (last.value = '编辑'), text: '编辑' },
  {
    danger: true,
    key: 'delete',
    popConfirm: {
      cancelText: '取消',
      confirm: () => (last.value = '已删除'),
      okText: '确认',
      title: '确定删除这一行吗？',
    },
    text: '删除',
  },
];
</script>
<template>
  <div>
    <VbenTableAction :actions="actions" align="start" />
    <p style="margin-top: 8px; font-size: 13px; opacity: 0.7">
      最近操作：{{ last }}
    </p>
  </div>
</template>
