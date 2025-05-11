<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { useRouter } from 'vue-router';
import { Page, ApiComponent } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { Select, RangePicker, Button, Modal } from 'ant-design-vue';
import { getStoreAllApi, getSupplierAllApi, getPurchaseListApi } from '#/api';
import dayjs, { Dayjs } from 'dayjs';
import { defineOptions, ref, h, reactive } from 'vue';
import { usePurchaseStore } from '#/store';
import { useTabbarStore } from '@vben/stores';

defineOptions({ name: `PurchaseList` });

const router = useRouter();
const tabsStore = useTabbarStore();
const purchaseStore = usePurchaseStore();
const form = reactive({
  storeId: undefined,
  supplierId: undefined,
});
const dates = ref<Dayjs[]>([dayjs().startOf('month'), dayjs().endOf('month')]);
const gridOptions: VxeGridProps = {
  columns: [
    {
      field: 'seq',
      type: 'seq',
      width: 70,
      fixed: 'left',
    },
    {
      field: 'purchaseOrderNo',
      title: '交易单号',
      width: 160,
      fixed: 'left',
      className: ({ row }) =>
        row.purchaseStatus == 1 ? 'text-[#f0a020] ' : '',
    },
    { field: 'purchaseTradeAt', title: '交易时间', width: 90, fixed: 'left' },
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
            return h(
              'span',
              { class: 'bg-[#fceace] text-[#f0a020] p-2' },
              '待审核',
            );
          } else if (row.purchaseStatus == 2) {
            return h(
              'span',
              { class: 'bg-[#e7f5ee] text-[#18a058] p-2 ' },
              '已审核',
            );
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
    {
      field: 'action',
      title: '操作',
      width: 100,
      slots: {
        default: 'action',
      },
      fixed: 'right',
    },
  ],

  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getPurchaseListApi({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          startDate: dates.value[0].format('YYYY-MM-DD'),
          endDate: dates.value[1].format('YYYY-MM-DD'),
          ...form,
        });
      },
    },
  },
};
const handleOpenPurchaseOrder = ({ row }) => {
  for (const { name } of tabsStore.getTabs) {
    if (name === 'Purchase') {
      Modal.confirm({
        title: '采购入库单',
        content: '采购入库单已存在，是否继续？',
        centered: true,
        onOk() {
          purchaseStore.$patch((state) => {
            state.purchaseId = row.id;
            state.refreshView = !state.refreshView;
          });
          router.push({ name: 'Purchase' });
        },
      });
      return;
    }
  }
  purchaseStore.$patch((state) => {
    state.purchaseId = row.id;
    state.refreshView = !state.refreshView;
  });
  router.push({ name: 'Purchase' });
};
const gridEvents = {
  cellDblclick: handleOpenPurchaseOrder,
};
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions, gridEvents });
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
            v-model:value="form.storeId"
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
            v-model:value="form.supplierId"
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
        <div>
          <Button type="primary" @click="gridApi.query()">查询</Button>
        </div>
      </div>
    </template>

    <Grid>
      <template #action="{ row }">
        <Button
          type="link"
          size="small"
          @click="handleOpenPurchaseOrder({ row })"
        >
          入库详单
        </Button>
      </template>
    </Grid>
  </Page>
</template>
