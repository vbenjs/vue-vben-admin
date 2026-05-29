<script lang="ts" setup>
import { VbenDescriptions } from '@vben/common-ui';

const items = [
  { content: 'Vben', label: '用户名' },
  { content: '13800138000', label: '手机号' },
  { content: '中国 · 杭州', label: '居住地' },
  { content: '前端工程师', label: '职位' },
];
</script>
<template>
  <div style="display: flex; flex-direction: column; gap: 16px">
    <VbenDescriptions
      size="small"
      bordered
      title="Small"
      :column="2"
      :items="items"
    />
    <VbenDescriptions
      size="middle"
      bordered
      title="Middle"
      :column="2"
      :items="items"
    />
    <VbenDescriptions
      size="large"
      bordered
      title="Large"
      :column="2"
      :items="items"
    />
  </div>
</template>
