<script lang="ts" setup>
import type { UseVbenVxeGrid, VxeGridProps } from '#/adapter/vxe-table';

import { inject } from 'vue';

import { getExampleTableApi } from '../mock-api';

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}

const useVbenVxeGrid = inject<UseVbenVxeGrid>(
  'useVbenVxeGrid',
) as UseVbenVxeGrid;

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { editRender: { name: 'input' }, field: 'category', title: 'Category' },
    { editRender: { name: 'input' }, field: 'color', title: 'Color' },
    {
      editRender: { name: 'input' },
      field: 'productName',
      title: 'Product Name',
    },
    { field: 'price', title: 'Price' },
    { field: 'releaseDate', formatter: 'formatDateTime', title: 'Date' },
  ],
  editConfig: {
    mode: 'cell',
    trigger: 'click',
  },
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
  showOverflow: true,
};

const [Grid] = useVbenVxeGrid({ gridOptions });
</script>

<template>
  <div class="vp-raw w-full">
    <Grid />
  </div>
</template>
