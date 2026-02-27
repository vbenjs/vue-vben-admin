<template>
  <FlowTaskList
    title="已办流程"
    description="我已处理完成的审批流程记录。"
    queryType="done"
  />
</template>

<script setup lang="ts">
import FlowTaskList from './FlowTaskList.vue';
</script>
