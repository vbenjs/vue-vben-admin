<script lang="ts" setup>
// @ts-nocheck
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { sysGenApi } from '#/api/core/sys-manage';

const emit = defineEmits(['success']);

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    items: [
      { fieldName: 'tableName', label: '表名称', component: 'Input' },
      { fieldName: 'tableComment', label: '表描述', component: 'Input' },
    ],
    wrapperClass: 'grid-cols-2',
  },
  gridOptions: {
    checkboxConfig: { highlight: true },
    columns: [
      { type: 'checkbox', width: 50 },
      { title: '表名称', field: 'tableName' },
      { title: '表描述', field: 'tableComment' },
      { title: '创建时间', field: 'createTime' },
      { title: '更新时间', field: 'updateTime' },
    ],
    height: 400,
    keepSource: true,
    pagerConfig: { enabled: false }, // usually imports list all remaining tables, or can use pager
    proxyConfig: {
      ajax: {
        query: async (_, formValues) => {
          const res = await sysGenApi.getDbTables(formValues);
          return { items: res.items || [] };
        },
      },
    },
  },
});

const submitLoading = ref(false);

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    const records = gridApi.grid.getCheckboxRecords();
    if (records.length === 0) {
      message.warning('请选择要导入的表');
      return;
    }
    const tableNames = records.map((r: any) => r.tableName);
    try {
      submitLoading.value = true;
      modalApi.setState({ confirmLoading: true });
      await sysGenApi.importTables(tableNames);
      message.success('导入成功');
      emit('success');
      modalApi.close();
    } catch {
      // ignore empty catch
    } finally {
      submitLoading.value = false;
      modalApi.setState({ confirmLoading: false });
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      gridApi.reload();
    }
  },
  title: '导入表',
  class: 'w-[800px]',
});
</script>

<template>
  <Modal>
    <div class="h-[500px]">
      <Grid />
    </div>
  </Modal>
</template>
