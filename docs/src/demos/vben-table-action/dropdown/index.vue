<script lang="ts" setup>
import type { ActionItem } from '@vben/common-ui';

import { ref } from 'vue';

import { VbenTableAction } from '@vben/common-ui';

const last = ref('无');

const actions: ActionItem[] = [
  { key: 'edit', onClick: () => (last.value = '编辑'), text: '编辑' },
];

const dropdownActions: ActionItem[] = [
  { key: 'copy', onClick: () => (last.value = '复制'), text: '复制' },
  { key: 'export', onClick: () => (last.value = '导出'), text: '导出' },
  {
    danger: true,
    key: 'remove',
    // 下拉项同样支持气泡确认
    popConfirm: {
      cancelText: '取消',
      confirm: () => (last.value = '已移除'),
      okText: '确认',
      title: '确定移除吗？',
    },
    text: '移除',
  },
];
</script>
<template>
  <div>
    <VbenTableAction
      :actions="actions"
      :dropdown-actions="dropdownActions"
      align="start"
      divider
      more-text="更多"
    />
    <p style="margin-top: 8px; font-size: 13px; opacity: 0.7">
      最近点击：{{ last }}
    </p>
  </div>
</template>
