<script lang="ts" setup>
import type { ActionItem } from '@vben/common-ui';

import { VbenTableAction } from '@vben/common-ui';

const actions: ActionItem[] = [
  { key: 'edit', text: '编辑', tooltip: '编辑这一行' },
  {
    key: 'detail',
    text: '详情',
    tooltip: { content: '查看详情', side: 'top' },
  },
];
</script>
<template>
  <VbenTableAction :actions="actions" align="start" />
</template>
