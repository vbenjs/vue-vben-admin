<script setup lang="ts">
import ApprovalList from './ApprovalList.vue';
</script>

<template>
  <ApprovalList
    title="待审流程"
    description="所有正在流转中尚未完成的审批单据。"
    query-type="pending"
  />
</template>
