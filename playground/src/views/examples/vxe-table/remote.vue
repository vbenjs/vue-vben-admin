<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter';

import { Page } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter';
import { getExampleTableApi } from '#/api';

import DocButton from '../doc-button.vue';

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}

const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { align: 'left', title: 'Name', type: 'checkbox', width: 100 },
    { field: 'category', title: 'Category' },
    { field: 'color', title: 'Color' },
    { field: 'productName', title: 'Product Name' },
    { field: 'price', title: 'Price' },
    { field: 'releaseDate', title: 'Date' },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getExampleTableApi({
          page: page.currentPage,
          pageSize: page.pageSize,
        });
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

function reload(page?: number) {
  gridApi.reload(page);
}
</script>

<template>
  <Page
    auto-content-height
    description="通过远程加载数据的方式，实现表格数据的展示，该示例也展示了表格的自适应高度，同时开启分页"
    title="远程加载示例"
  >
    <template #extra>
      <DocButton path="/components/common-ui/vben-vxe-table" />
    </template>
    <Grid>
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="reload()">
          刷新当前页面
        </Button>
        <Button type="primary" @click="reload(1)"> 刷新并返回第一页 </Button>
      </template>
    </Grid>
  </Page>
</template>
