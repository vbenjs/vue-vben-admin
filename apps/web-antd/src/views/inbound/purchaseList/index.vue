<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, ApiComponent } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { Select, RangePicker } from 'ant-design-vue';
import { getStoreAllApi, getSupplierAllApi, getPurchaseListApi } from '#/api';
import dayjs, { Dayjs } from 'dayjs';
import { defineOptions, ref, h } from 'vue';

defineOptions({ name: `PurchaseList` });

const dates = ref<Dayjs[]>([dayjs().startOf('month'), dayjs().endOf('month')]);
const gridOptions: VxeGridProps = {
  columns: [
    {
      field: 'id',
      title: '编码',
      width: 70,
      fixed: 'left',
    },
    {
      field: 'purchaseOrderNo',
      title: '交易单号',
      width: 160,
      fixed: 'left',
      className: ({ row }) =>
        row.purchaseStatus == 1 ? '!text-orange-500' : '',
    },
    { field: 'purchaseTradeAt', title: '交易时间', width: 120, fixed: 'left' },
    { field: 'purchaseStoreName', title: '所属仓库', width: 145 },
    { field: 'purchaseSupplierName', title: '供应商', width: 160 },
    { field: 'purchaseBankName', title: '付款银行', width: 145 },
    {
      field: 'purchasePayableAmount',
      title: '应付金额',
      width: 100,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'purchasePaidAmount',
      title: '已付金额',
      width: 100,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'purchaseArrearsAmount',
      title: '欠款金额',
      width: 100,
      align: 'right',
      headerAlign: 'center',
      className: ({ row }) =>
        row.purchaseArrearsAmount > 0 ? 'text-red-500 font-bold' : '',
    },
    {
      field: 'purchaseDiscountAmount',
      title: '优惠金额',
      width: 100,
      align: 'right',
      headerAlign: 'center',
    },
    { field: 'purchaseAuditorBy', title: '审核人', width: 120 },
    { field: 'purchaseAuditorAt', title: '审核时间', width: 145 },
    { field: 'purchaseHandlerName', title: '经办人', width: 120 },
    {
      field: 'purchaseStatus',
      title: '状态',
      width: 80,
      slots: {
        default: ({ row }) => {
          if (row.purchaseStatus == 1) {
            return h('span', { class: 'text-orange-500' }, '待审核');
          } else if (row.purchaseStatus == 2) {
            return h('span', { class: 'text-green-700' }, '已审核');
          } else {
            return '';
          }
        },
      },
    },
    {
      field: 'purchaseDesc',
      title: '描述',
      width: 200,
      align: 'left',
      headerAlign: 'center',
    },
    { field: 'purchaseCreatedBy', title: '创建人', width: 120 },
    { field: 'purchaseUpdatedBy', title: '更新人', width: 120 },
    { field: 'purchaseCreatedAt', title: '创建时间', width: 145 },
    { field: 'purchaseUpdatedAt', title: '更新时间', width: 145 },
  ],

  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getPurchaseListApi({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          startDate: dates.value[0].format('YYYY-MM-DD'),
          endDate: dates.value[1].format('YYYY-MM-DD'),
        });
      },
    },
  },
};
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
</script>
<template>
  <Page auto-content-height>
    <template #title>
      <div class="flex flex-wrap gap-2">
        <div class="flex w-[220px] items-center">
          <span class="mr-2">仓库</span>
          <ApiComponent
            :component="Select"
            :api="getStoreAllApi"
            labelField="name"
            valueField="id"
            class="flex-1"
            placeholder="请选择仓库"
            autoSelect="first"
            allowClear
          />
        </div>
        <div class="flex w-[220px] items-center">
          <span class="mr-2">供货商</span>
          <ApiComponent
            :component="Select"
            :api="getSupplierAllApi"
            labelField="name"
            valueField="id"
            class="flex-1"
            placeholder="请选择供货商"
            autoSelect="first"
            allowClear
          />
        </div>
        <div>
          <span>查询时间：</span>
          <RangePicker
            v-model:value="dates"
            class="w-[220px]"
            :allow-clear="false"
          />
        </div>
      </div>
    </template>

    <Grid></Grid>
  </Page>
</template>
