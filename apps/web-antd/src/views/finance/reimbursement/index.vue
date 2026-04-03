<script setup lang="ts">
import FinanceQueryList from '../_shared/FinanceQueryList.vue';
</script>

<template>
  <FinanceQueryList
    title="报销单查询"
    description="通过 legacy-sql 兼容层读取 G3 报销单主表，当前提供只读分页查询能力。"
    detail-query-key="reimbursement-detail"
    query-key="reimbursement-list"
  />
</template>
