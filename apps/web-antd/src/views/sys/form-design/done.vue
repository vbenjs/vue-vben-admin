<script setup lang="ts">
import FlowTaskList from './FlowTaskList.vue';
</script>

<template>
  <FlowTaskList
    title="已办流程"
    description="我已处理完成的审批流程记录。"
    query-type="done"
  />
</template>
