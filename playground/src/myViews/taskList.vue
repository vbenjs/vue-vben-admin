<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { Button, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getTaskList } from '#/api';

interface RowType {
  created_at: string;
  custom_field: null | string;
  description: string;
  due_date: string;
  id: number;
  priority: number;
  status: string;
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
      width: 200,
    },
    {
      field: 'created_at',
      formatter: 'formatDateTime',
      title: '创建时间',
      width: 170,
    },
    {
      field: 'updated_at',
      formatter: 'formatDateTime',
      title: '更新时间',
      width: 170,
    },
    { field: 'custom_field', title: '其他', width: 100 },
    { field: 'status', title: '状态', width: 130 },
    { field: 'priority', title: '优先级', width: 50 },
    {
      field: 'due_date',
      formatter: 'formatDateTime',
      title: '截止时间',
      width: 170,
    },
    { fixed: 'right', slots: { default: 'action' }, title: '操作', width: 250 },
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

function handleEdit() {
  // alert('编辑');
}
function handleDelete(row: RowType) {
  // console.log("删除  " + row.title);
  return row.title;
}

const [Grid] = useVbenVxeGrid({ gridOptions });
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #status="{ RowType: row }">
        <Tag color="blue">
          {{ row.status }}
        </Tag>
      </template>
      <template #action="{ row }">
        <div class="button-group">
          <Button type="link" @click="handleEdit">编辑</Button>
          <Button type="link" @click="handleDelete(row)">删除</Button>
          <Button type="link">开始</Button>
        </div>
      </template>
    </Grid>
  </Page>
</template>

<style scoped>
.button-group {
  display: flex;
  gap: 4px; /* 控制按钮间距 */
}
</style>
