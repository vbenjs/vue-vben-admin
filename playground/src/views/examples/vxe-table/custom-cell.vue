<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter';

import { Page } from '@vben/common-ui';

import { Button, Image, Switch, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter';
import { getExampleTableApi } from '#/api';

import DocButton from '../doc-button.vue';

interface RowType {
  category: string;
  color: string;
  id: string;
  imageUrl: string;
  open: boolean;
  price: string;
  productName: string;
  releaseDate: string;
  status: 'error' | 'success' | 'warning';
}

const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { field: 'category', title: 'Category', width: 100 },
    {
      field: 'imageUrl',
      slots: { default: 'image-url' },
      title: 'Image',
      width: 100,
    },
    {
      field: 'open',
      slots: { default: 'open' },
      title: 'Open',
      width: 100,
    },
    {
      field: 'status',
      slots: { default: 'status' },
      title: 'Status',
      width: 100,
    },
    { field: 'color', title: 'Color', width: 100 },
    { field: 'productName', title: 'Product Name', width: 200 },
    { field: 'price', title: 'Price', width: 100 },
    {
      field: 'releaseDate',
      formatter: ({ cellValue }) => {
        return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss');
      },
      title: 'Date',
      width: 200,
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 120,
    },
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

const [Grid] = useVbenVxeGrid({ gridOptions });
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
      <template #image-url="{ row }">
        <Image :src="row.imageUrl" height="30" width="30" />
      </template>
      <template #open="{ row }">
        <Switch v-model:checked="row.open" />
      </template>
      <template #status="{ row }">
        <Tag :color="row.color">{{ row.status }}</Tag>
      </template>
      <template #action>
        <Button type="link">编辑</Button>
      </template>
    </Grid>
  </Page>
</template>
