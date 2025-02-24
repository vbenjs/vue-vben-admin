<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getTaskList } from '#/api';

interface RowType {
  created_at: string;
  custom_field: null | string;
  description: string;
  due_date: string;
  id: number;
  priority: number;
  status: number;
  title: string;
  updated_at: string;
}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { field: 'title', title: '任务', width: 100 },
    {
      field: 'description',
      title: '描述',
      width: 100,
    },
    {
      field: 'created_at',
      title: '创建时间',
      width: 130,
    },
    {
      field: 'updated_at',
      title: '更新时间',
      width: 100,
    },
    { field: 'custom_field', title: '其他', width: 100 },
    { field: 'status', title: '状态', width: 100 },
    { field: 'priority', title: '优先级', width: 100 },
    { field: 'due_date', title: '截止时间', width: 100 },
    { slots: { default: 'action' }, title: '操作', width: 100 },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getTaskList({
          page: page.currentPage,
          page_size: page.pageSize,
        });
      },
    },
  },
  showOverflow: false,
};

const [Grid] = useVbenVxeGrid({ gridOptions });
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #status="{ row }">
        <Tag :color="row.status === 1 ? 'success' : 'error'">
          {{ row.status }}
        </Tag>
      </template>
      <template #action>
        <Button type="link">编辑</Button>
      </template>
    </Grid>
  </Page>
</template>
