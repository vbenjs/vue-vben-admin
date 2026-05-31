<script lang="ts" setup>
import { VbenDescriptions, VbenDescriptionsItem } from '@vben/common-ui';
</script>
<template>
  <!-- 通过子组件 VbenDescriptionsItem 声明列表项 -->
  <VbenDescriptions bordered :column="2">
    <VbenDescriptionsItem label="用户名">Vben</VbenDescriptionsItem>
    <VbenDescriptionsItem label="状态">
      <span style="color: #52c41a">● 正常</span>
    </VbenDescriptionsItem>
    <VbenDescriptionsItem label="备注" :span="2">
      <template #content>
        <span style="color: #888">通过 #content 插槽自定义内容</span>
      </template>
    </VbenDescriptionsItem>
  </VbenDescriptions>
</template>
