<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'printTemplate_add'"
        >
          新建
        </a-button>
      </template>
    </BasicTable>
    <PrintTemplateDrawer @register="registerPrintTemplateDrawer" @success="reload" />
    <SelectPrinterModal @register="registerSelectPrinterModal" @success="handleSuccess" />
  </div>
</template>
<script lang="tsx" setup>
  import { useDrawer } from '@/components/Drawer';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { TableResult, getColumns, getFormConfig } from './data';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import {
    deletePrintTemplate,
    getPrintTemplate,
    getPrintTemplateById,
    testPrintTemplate,
  } from '@/api/configuration/printTemplate';
  import { useModal } from '@/components/Modal';
  import { useGo } from '@/hooks/web/usePage';
  import { HashingFactory } from '@/utils/cipher';

  const PrintTemplateDrawer = createAsyncComponent(() => import('./Popup/PrintTemplateDrawer.vue'));
  const SelectPrinterModal = createAsyncComponent(() => import('./Popup/SelectPrinterModal.vue'));

  defineOptions({ name: 'PrintTemplate' });

  const go = useGo();

  const [registerPrintTemplateDrawer, { openDrawer }] = useDrawer();
  const [registerSelectPrinterModal, { openModal }] = useModal();

  const [registerTable, { reload }] = useTable({
    api: (where) => getPrintTemplate(where, null, true),
    columns: getColumns(),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),

    loading: true,
    showIndexColumn: false,
    showTableSetting: true,
    actionColumn: {
      width: 140,
      title: '操作',
      dataIndex: 'action',
      auth: [
        'printTemplate_edit',
        'printTemplate_del',
        'printTemplate_updateContent',
        'printTemplate_print',
      ],
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
            auth: 'printTemplate_edit',
            onClick: async () => {
              const data = await getPrintTemplateById(record.id);
              openDrawer(true, {
                actionKey: 'edit',
                record: data,
              });
            },
          },
          {
            icon: 'ant-design:file-text-outlined',
            tooltip: '更新内容',
            auth: 'printTemplate_updateContent',
            onClick: async () => {
              const md5 = HashingFactory.createMD5Hashing().hash(String(record.id));
              go({ path: '/configuration/print_template/update/' + md5, query: { id: record.id } });
            },
          },
          {
            icon: 'ant-design:printer-outlined',
            tooltip: '打印测试',
            auth: 'printTemplate_print',
            onClick: async () => {
              openModal(true, { templateId: record.id });
            },
          },
          {
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: 'printTemplate_del',
            popConfirm: {
              title: '是否确认删除？',
              placement: 'left',
              confirm: async () => {
                await deletePrintTemplate([record.id]);
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

  const handleSuccess = async ({ templateId, printerId }) => {
    await testPrintTemplate(printerId, templateId);
  };
</script>
