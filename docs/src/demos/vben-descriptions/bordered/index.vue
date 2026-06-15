<script lang="ts" setup>
import { VbenDescriptions } from '@vben/common-ui';

const items = [
  { content: 'Vben', label: '用户名' },
  { content: '13800138000', label: '手机号' },
  { content: '正常', label: '状态' },
  { content: '中国 · 杭州', label: '居住地' },
  {
    content: '浙江省杭州市西湖区某某街道某某小区 1 幢 2 单元',
    label: '地址',
    span: 3,
  },
];
</script>
<template>
  <VbenDescriptions bordered title="用户信息" :items="items">
    <template #extra>
      <span style="color: #1677ff; cursor: pointer">编辑</span>
    </template>
  </VbenDescriptions>
</template>
