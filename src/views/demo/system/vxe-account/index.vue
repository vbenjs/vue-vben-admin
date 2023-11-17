<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <div class="m-4 vxebasic-form-container">
      <VxeBasicTable ref="tableRef" v-bind="gridOptions">
        <template #action="{ row }">
          <TableAction outside :actions="createActions(row)" />
        </template>
      </VxeBasicTable>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { ActionItem, TableAction } from '@/components/Table';
  import { getAccountList } from '@/api/demo/system';
  import { PageWrapper } from '@/components/Page';
  import DeptTree from '../account/DeptTree.vue';
  import { columns, searchFormSchema } from './vxeAccount.data';
  import { BasicTableProps, VxeBasicTable, VxeGridInstance } from '@/components/VxeTable';

  const tableRef = ref<VxeGridInstance>();
  const searchInfo = ref();
  const gridOptions = reactive<BasicTableProps>({
    id: 'VxeTable',
    keepSource: true,
    columns: columns,
    formConfig: {
      enabled: true,
      items: searchFormSchema,
    },
    height: 'auto',
    proxyConfig: {
      ajax: {
        query: async ({ page, form }) => {
          return getAccountList({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...form,
            searchInfo: searchInfo.value,
          });
        },
      },
    },
  });

  const handleSelect = (deptId = '') => {
    searchInfo.value = deptId;
    if (tableRef.value) {
      tableRef.value.commitProxy('query');
    }
  };

  // 操作按钮（权限控制）
  const createActions = (record) => {
    const actions: ActionItem[] = [
      {
        label: '详情',
        onClick: () => {
          console.log(record);
        },
      },
      {
        label: '编辑',
        onClick: () => {},
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '是否确认删除',
          confirm: () => {
            tableRef.value?.remove(record);
          },
        },
      },
    ];

    return actions;
  };
</script>
<style lang="less" scope>
  .vxebasic-form-container {
    flex: auto;
  }
</style>
