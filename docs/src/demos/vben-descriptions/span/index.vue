<script lang="ts" setup>
import { VbenDescriptions } from '@vben/common-ui';

const items = [
  { content: '1', label: 'A' },
  { content: '2（span: 2）', label: 'B', span: 2 },
  { content: '3', label: 'C' },
  { content: '占满当前行剩余空间', label: 'D（span: filled）', span: 'filled' },
  { content: '5', label: 'E' },
];
</script>
<template>
  <!-- 列数随断点变化：xs 1 列、sm 2 列、md 及以上 3 列 -->
  <VbenDescriptions bordered :column="{ md: 3, sm: 2, xs: 1 }" :items="items" />
</template>
