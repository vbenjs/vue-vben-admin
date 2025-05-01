<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { ProductApi } from '#/api';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Input, RangePicker } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getProductRecordListApi } from '#/api';

defineOptions({ name: 'ProductRecord' });
const dates = ref<Dayjs[]>([dayjs().startOf('month'), dayjs().endOf('month')]);
const keyword = ref<string>('');
const gridOptions: VxeGridProps<ProductApi.ProductRecordItem> = {
  columns: [
    { field: 'id', title: '编码', width: 70, fixed: 'left' },
    { field: 'storeName', title: '仓库名称', width: 150, fixed: 'left' },
    { field: 'productName', title: '产品名称', width: 150, fixed: 'left' },
    { field: 'productId', title: '产品编码', width: 100 },
    { field: 'productPinyin', title: '拼音', width: 150 },
    { field: 'productBarcode', title: '条形码', width: 150 },
    { field: 'productUnit', title: '单位', width: 80 },
    { field: 'productSpec', title: '规格', width: 120 },
    { field: 'productColor', title: '颜色', width: 100 },
    { field: 'busTypeName', title: '业务类型名称', width: 120 },
    {
      field: 'orderNo',
      title: '交易单号',
      width: 200,
    },
    {
      field: 'num',
      title: '数量',
      width: 100,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'price',
      title: '单价',
      width: 100,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'totalPrice',
      title: '总价',
      width: 100,
      align: 'right',
      headerAlign: 'center',
    },
    { field: 'createdAt', title: '交易时间', width: 145 },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getProductRecordListApi({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          startDate: dates.value[0].format('YYYY-MM-DD'),
          endDate: dates.value[1].format('YYYY-MM-DD'),
          keyword: keyword.value,
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
      <div class="flex gap-2">
        <div>
          <span class="mr-2">产品</span>
          <Input
            allow-clear
            v-model:value="keyword"
            placeholder="请输入名称、编码、拼音码、条码"
            class="w-[260px]"
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
          <Button type="primary" @click="gridApi.reload()">查询</Button>
        </div>
      </div>
    </template>
    <Grid />
  </Page>
</template>
