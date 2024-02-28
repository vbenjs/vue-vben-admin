<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'printer_add'"
        >
          新建
        </a-button>
      </template>
    </BasicTable>
    <PrinterDrawer @register="registerPrinterDrawer" @success="reload" />
  </div>
</template>
<script lang="tsx" setup>
  import { useDrawer } from '@/components/Drawer';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { TableResult, getColumns, getFormConfig } from './data';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { deletePrinter, getPrinter, getPrinterById } from '@/api/configuration/printer';

  const PrinterDrawer = createAsyncComponent(() => import('./Popup/PrinterDrawer.vue'));

  defineOptions({ name: 'PrintTemplate' });

  const [registerPrinterDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload }] = useTable({
    api: (where) => getPrinter(where, null, true),
    columns: getColumns(),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),

    loading: true,
    showIndexColumn: false,
    showTableSetting: true,
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
      auth: ['printer_edit', 'printer_del'],
      customRender: ({ record }) => {
        return createActions(record as TableResult);
      },
    },
  });

  const createActions = (record: TableResult) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'clarity:note-edit-line',
            tooltip: '编辑',
            auth: 'printer_edit',
            onClick: async () => {
              const data = await getPrinterById(record.id);
              openDrawer(true, {
                actionKey: 'edit',
                record: data,
              });
            },
          },
          {
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: 'printer_del',
            popConfirm: {
              title: '是否确认删除？',
              placement: 'left',
              confirm: async () => {
                await deletePrinter([record.id]);
                reload();
              },
            },
          },
        ]}
      />
    );
  };

  const handleCreate = () => {
    openDrawer(true, {
      actionKey: 'create',
    });
  };
</script>
