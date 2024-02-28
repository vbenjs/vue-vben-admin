<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'printRule_add'"
        >
          新建
        </a-button>
      </template>
    </BasicTable>

    <PrintRulesDrawer @register="registerPrintRulesDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="tsx" setup>
  import { deletePrintRule, getPrintRule, getPrintRuleById } from '@/api/configuration/printRule';
  import { getFormConfig, getColumns, TableResult } from './data';
  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  const PrintRulesDrawer = createAsyncComponent(() => import('./Popup/PrintRulesDrawer.vue'));

  defineOptions({ name: 'PrintRules' });

  const [registerPrintRulesDrawer, { openDrawer: openPrintRulesDrawer }] = useDrawer();
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    api: (where) => getPrintRule(where, null, true),
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
      auth: ['printRule_edit', 'printRule_del'],
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
            auth: 'printRule_edit',
            onClick: async () => {
              const data = await getPrintRuleById(record.id);
              openPrintRulesDrawer(true, {
                actionKey: 'edit',
                record: data,
              });
            },
          },
          {
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: 'printRule_del',
            popConfirm: {
              title: '是否确认删除？',
              placement: 'left',
              confirm: async () => {
                await deletePrintRule([record.id]);
                reload();
              },
            },
          },
        ]}
      />
    );
  };
  function handleSuccess({ action, values }) {
    if (action == 'edit') {
      updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  }

  const handleCreate = () => {
    openPrintRulesDrawer(true, {
      actionKey: 'create',
    });
  };
</script>
