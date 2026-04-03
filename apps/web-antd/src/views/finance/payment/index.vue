<script setup lang="ts">
import FinanceQueryList from '../_shared/FinanceQueryList.vue';
</script>

<template>
  <FinanceQueryList
    title="支付单查询"
    description="通过 legacy-sql 兼容层读取 G3 支付单视图，当前提供只读分页查询能力。"
    detail-query-key="payment-bill-list"
    query-key="payment-list"
  />
</template>
