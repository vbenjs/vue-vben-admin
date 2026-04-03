<script lang="ts" setup>
// @ts-nocheck
import type { VbenFormProps } from '@vben/common-ui';

// @ts-nocheck
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';

import { message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { sysGenApi } from '#/api/core/sys-manage';

import ImportTableModal from './ImportTableModal.vue';

const router = useRouter();

const formOptions: VbenFormProps = {
  items: [
    {
      component: 'Input',
      fieldName: 'tableName',
      label: '表名称',
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
};

const gridOptions = reactive({
  columns: [
    { title: '编号', field: 'tableId', width: 60 },
    { title: '表名称', field: 'tableName' },
    { title: '表描述', field: 'tableComment' },
    { title: '实体类名', field: 'className' },
    { title: '创建时间', field: 'createTime' },
    { title: '更新时间', field: 'updateTime' },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 200,
      fixed: 'right',
    },
  ],
  toolbarConfig: {
    custom: true,
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const params = {
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        };
        const res = await sysGenApi.getList(params);
        return {
          items: res.items || [],
          total: res.total || 0,
        };
      },
    },
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [ImportModal, importModalApi] = useVbenModal({
  connectedComponent: ImportTableModal,
});

function handleImport() {
  importModalApi.open();
}

function handleSuccess() {
  gridApi.reload();
}

function handleEdit(row: any) {
  router.push(`/sys/gen/edit/${row.tableId}`);
}

async function handleDelete(row: any) {
  Modal.confirm({
    title: '确认删除',
    content: `确认删除表 ${row.tableName} 吗？`,
    onOk: async () => {
      await sysGenApi.remove(row.tableId);
      message.success('删除成功');
      gridApi.reload();
    },
  });
}

async function handleGenerate(row: any) {
  Modal.confirm({
    title: '确认生成',
    content: `即将使用 ${row.tableName} 的配置自动生成后端接口与前端 CRUD 代码，并写入项目目录，可能会覆盖此前生成的同名文件，确认要生成吗？`,
    onOk: async () => {
      const res = await sysGenApi.generateCode(row.tableId);
      message.success(res.message || '生成成功');
    },
  });
}

async function handleSync(row: any) {
  Modal.confirm({
    title: '确认同步',
    content: `由于数据库可能会修改表结构，同步操作会重新拉取 ${row.tableName} 字段信息并保留你目前的配置，确认要同步吗？`,
    onOk: async () => {
      await sysGenApi.syncTable(row.tableId);
      message.success('同步成功');
      gridApi.reload();
    },
  });
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <div class="flex gap-2">
          <a-button type="primary" @click="handleImport">导入</a-button>
        </div>
      </template>

      <template #action="{ row }">
        <div class="flex gap-2">
          <a-button type="link" size="small" @click="handleEdit(row)">
            编辑
          </a-button>
          <a-button type="link" size="small" @click="handleSync(row)">
            同步
          </a-button>
          <a-button type="link" size="small" @click="handleGenerate(row)">
            生成代码
          </a-button>
          <a-button type="link" size="small" danger @click="handleDelete(row)">
            删除
          </a-button>
        </div>
      </template>
    </Grid>

    <ImportModal @success="handleSuccess" />
  </Page>
</template>
