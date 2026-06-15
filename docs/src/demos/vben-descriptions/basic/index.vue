<script lang="ts" setup>
import { VbenDescriptions } from '@vben/common-ui';

const items = [
  { content: 'Vben', label: '用户名' },
  { content: '13800138000', label: '手机号' },
  { content: '中国 · 杭州', label: '居住地' },
  { content: '前端工程师', label: '职位' },
  {
    content: '这是一段较长的备注信息，用于演示跨列展示。',
    label: '备注',
    span: 3,
  },
];
</script>
<template>
  <VbenDescriptions :items="items" />
</template>
