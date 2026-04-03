<script setup lang="ts">
import ApprovalList from './ApprovalList.vue';
</script>

<template>
  <ApprovalList
    title="审批通过"
    description="已通过审批的所有历史单据。"
    query-type="approved"
  />
</template>
