<template>
  <PageWrapper
    title="VxeTable表格"
    content="只展示部分操作，详细功能请查看VxeTable官网事例"
    contentFullHeight
    fixedHeight
  >
    <VxeBasicTable ref="tableRef" v-bind="gridOptions">
      <template #action="{ row }">
        <TableAction :actions="createActions(row)" />
      </template>
    </VxeBasicTable>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { vxeTableColumns, vxeTableFormSchema } from './tableData';
  import { VxeBasicTable, BasicTableProps, VxeGridInstance } from '/@/components/VxeTable';
  import { demoListApi } from '/@/api/demo/table';

  const { createMessage } = useMessage();

  const tableRef = ref<VxeGridInstance>();

  const gridOptions = reactive<BasicTableProps>({
    id: 'VxeTable',
    editConfig: { trigger: 'click', mode: 'cell', showStatus: true },
    columns: vxeTableColumns,
    toolbarConfig: {
      buttons: [
        {
          content: '自定义按钮',
          buttonRender: {
            name: 'AButton',
            props: {
              type: 'primary',
            },
            events: {
              click: () => {
                createMessage.success('点击了自定义按钮');
              },
            },
          },
        },
      ],
    },
    formConfig: {
      enabled: true,
      items: vxeTableFormSchema,
    },
    height: 'auto',
    proxyConfig: {
      ajax: {
        query: async ({ page, form }) => {
          return demoListApi({
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            ...form,
          });
        },
        queryAll: async ({ form }) => {
          const data = await demoListApi(form);
          return data;
        },
      },
    },
  });

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
          confirm: () => {},
        },
      },
    ];

    return actions;
  };
</script>
