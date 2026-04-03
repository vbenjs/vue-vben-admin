<script lang="ts" setup>
// @ts-nocheck
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { requestClient } from '#/api/request';

const router = useRouter();

// APIs
const api = {
  getList: (params?: any) =>
    requestClient.get('/sys/print-design/list', { params }),
  remove: (id: number | string) =>
    requestClient.delete(`/sys/print-design/${id}`),
};

const [Grid] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { title: '模板编号', field: 'printCode' },
      { title: '模板名称', field: 'printName' },
      { title: '创建人', field: 'createBy' },
      { title: '创建时间', field: 'createTime' },
      { title: '状态', field: 'status' },
      {
        title: '操作',
        field: 'action',
        slots: { default: 'action' },
        width: 150,
        fixed: 'right',
      },
    ],
    proxyConfig: {
      ajax: {
        query: async ({ page }: any, formValues: any) => {
          const res = await api.getList({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
          return res;
        },
      },
    },
  },
});

const goToDesigner = (id: string) => {
  router.push(`/sys/print-design/designer?id=${id}`);
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <Button type="primary">新增</Button>
      </template>
      <template #action="{ row }">
        <Button type="link" size="small" @click="goToDesigner(row.printId)">
          设计
        </Button>
        <Button type="link" size="small" danger>删除</Button>
      </template>
    </Grid>
  </Page>
</template>
