<template>
  <FlowTaskList
    title="待办流程"
    description="等待我处理的审批流程单据。"
    queryType="todo"
  />
</template>

<script setup lang="ts">
import FlowTaskList from './FlowTaskList.vue';
</script>
