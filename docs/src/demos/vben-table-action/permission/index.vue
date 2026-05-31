<script lang="ts" setup>
import type { ActionItem } from '@vben/common-ui';

import { VbenTableAction } from '@vben/common-ui';

// 模拟当前用户拥有的权限码
const allow = new Set(['user:detail', 'user:edit']);

function hasPermission(auth?: string | string[]) {
  if (!auth) return true;
  const codes = Array.isArray(auth) ? auth : [auth];
  return codes.some((code) => allow.has(code));
}

const actions: ActionItem[] = [
  { auth: 'user:edit', key: 'edit', text: '编辑' },
  { auth: 'user:detail', key: 'detail', text: '详情' },
  // 无 user:delete 权限，按钮被隐藏
  { auth: 'user:delete', danger: true, key: 'delete', text: '删除（无权限）' },
];
</script>
<template>
  <VbenTableAction
    :actions="actions"
    :has-permission="hasPermission"
    align="start"
  />
</template>
