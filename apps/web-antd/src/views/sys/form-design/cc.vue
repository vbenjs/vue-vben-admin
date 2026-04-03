<script setup lang="ts">
import FlowTaskList from './FlowTaskList.vue';
</script>

<template>
  <FlowTaskList
    title="抄送流程"
    description="被抄送给我的流程审批通知。"
    query-type="cc"
  />
</template>
