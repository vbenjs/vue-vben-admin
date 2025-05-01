<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, ApiComponent } from '@vben/common-ui';
import { Select, InputSearch, Button } from 'ant-design-vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getStoreAllApi, getCurrentListApi } from '#/api';
import { reactive, h } from 'vue';

defineOptions({ name: `Current` });

const form = reactive({
  storeId: undefined,
  keyword: undefined,
});
const gridOptions: VxeGridProps = {
  columns: [
    { field: 'id', title: '编码', width: 70, fixed: 'left' },
    {
      field: 'storeName',
      title: '仓库名称',
      width: 120,
      fixed: 'left',
      slots: {
        default: ({ row }) => {
          return h(
            'span',
            {
              style: row.storeStatus === 0 ? { color: '#999' } : {},
            },
            row.storeName,
          );
        },
      },
    },
    { field: 'productName', title: '商品名称', width: 150, fixed: 'left' },
    { field: 'productId', title: '商品编码', width: 70 },
    { field: 'productPinyin', title: '拼音码', width: 100 },
    { field: 'productBarcode', title: '条码', width: 120 },
    { field: 'productUnit', title: '单位', width: 60 },
    { field: 'productSpec', title: '规格', width: 100 },
    { field: 'productColor', title: '颜色', width: 80 },
    {
      field: 'productMaxPrice',
      title: '最高进价',
      width: 100,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'productMinPrice',
      title: '最低售价',
      width: 100,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'productMaxLimit',
      title: '最高上限',
      width: 80,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'productMinLimit',
      title: '最低下限',
      width: 80,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'productSalePrice',
      title: '销售价',
      width: 100,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'productPurchasePrice',
      title: '采购价',
      width: 100,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'productIsVirtual',
      title: '劳务',
      width: 70,
      slots: {
        default: ({ row }) => {
          return row.productIsVirtual === 1
            ? h('span', { class: 'bg-[#e8f2fd] text-[#2080f0] p-2' }, '是')
            : '';
        },
      },
    },
    {
      field: 'productStatus',
      title: '状态',
      width: 70,
      slots: {
        default: ({ row }) => {
          return row.productStatus === 1
            ? h('span', { class: 'bg-[#e7f5ee] text-[#18a058] p-2 ' }, '正常')
            : h('span', { class: 'bg-[#fbeff1] text-[#d03050] p-2' }, '禁用');
        },
      },
    },
    {
      field: 'num',
      title: '库存数量',
      width: 80,
      align: 'right',
      headerAlign: 'center',
      slots: {
        default: ({ row }) => {
          return row.num === 0
            ? h('span', { style: 'color: #f00' }, row.num)
            : h('span', {}, row.num);
        },
      },
    },
    {
      field: 'price',
      title: '库存单价',
      width: 80,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'totalPrice',
      title: '库存总价',
      width: 120,
      align: 'right',
      headerAlign: 'center',
    },
    { field: 'createdAt', title: '入库时间', width: 145 },
    { field: 'updatedAt', title: '更新时间', width: 145 },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getCurrentListApi({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...form,
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
      <div class="flex gap-4">
        <div class="flex w-[200px] items-center">
          <span class="mr-2">仓库</span>
          <ApiComponent
            :api="getStoreAllApi"
            :component="Select"
            labelField="name"
            valueField="id"
            autoSelect="first"
            placeholder="请选择仓库"
            class="flex-1"
            v-model:value="form.storeId"
            allowClear
            @change="gridApi.reload()"
          />
        </div>
        <div class="flex w-[360px] items-center">
          <span class="mr-2">产品</span>
          <InputSearch
            placeholder="请输入编码、名称、拼音码、条码"
            class="flex-1"
            enterButton="查询"
            allowClear
            v-model:value="form.keyword"
            @search="gridApi.reload()"
          />
        </div>
      </div>
    </template>

    <Grid></Grid>
  </Page>
</template>
