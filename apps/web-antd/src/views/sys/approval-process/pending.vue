<template>
  <ApprovalList
    title="待审流程"
    description="所有正在流转中尚未完成的审批单据。"
    queryType="pending"
  />
</template>

<script setup lang="ts">
import ApprovalList from './ApprovalList.vue';
</script>
