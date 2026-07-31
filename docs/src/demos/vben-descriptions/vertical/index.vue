<script lang="ts" setup>
import type { DescriptionsItemType } from '@vben/common-ui';

import { VbenDescriptions } from '@vben/common-ui';

const items: DescriptionsItemType[] = [
  { content: 'Vben', label: '用户名' },
  { content: '13800138000', label: '手机号' },
  { content: '中国 · 杭州', label: '居住地' },
  { content: '这是一段较长的备注信息。', label: '备注', span: 3 },
];
</script>
<template>
  <VbenDescriptions bordered layout="vertical" :items="items" />
</template>
