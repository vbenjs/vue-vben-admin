<template>
  <PageWrapper title="基础详情页" contentBackground>
    <Description
      size="middle"
      title="退款申请"
      :bordered="false"
      :column="3"
      :data="refundData"
      :schema="refundSchema"
    />
    <Divider />
    <Description
      size="middle"
      title="用户信息"
      :bordered="false"
      :column="3"
      :data="personData"
      :schema="personSchema"
    />
    <Divider />

    <BasicTable @register="registerRefundTable" />
    <Divider />
    <BasicTable @register="registerTimeTable" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Description } from '@/components/Description';
  import { BasicTable, useTable } from '@/components/Table';
  import { PageWrapper } from '@/components/Page';
  import { Divider } from 'ant-design-vue';

  import {
    refundSchema,
    refundData,
    personSchema,
    personData,
    refundTableSchema,
    refundTimeTableSchema,
    refundTableData,
    refundTimeTableData,
  } from './data';

  const [registerRefundTable] = useTable({
    title: '退货商品',
    dataSource: refundTableData,
    columns: refundTableSchema,
    pagination: false,
    showIndexColumn: false,
    scroll: { y: 300 },
    showSummary: true,
    summaryFunc: handleSummary,
  });

  const [registerTimeTable] = useTable({
    title: '退货进度',
    columns: refundTimeTableSchema,
    pagination: false,
    dataSource: refundTimeTableData,
    showIndexColumn: false,
    scroll: { y: 300 },
  });

  function handleSummary(tableData: any[]) {
    let totalT5 = 0;
    let totalT6 = 0;
    tableData.forEach((item) => {
      totalT5 += item.t5;
      totalT6 += item.t6;
    });
    return [
      {
        t1: '总计',
        t5: totalT5,
        t6: totalT6,
      },
    ];
  }
</script>
<style lang="less" scoped>
  .desc-wrap {
    padding: 16px;
    background-color: @component-background;
  }
</style>
