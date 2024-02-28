<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'pda_add'"
        >
          新建
        </a-button>
      </template>
    </BasicTable>

    <PdaDrawer @register="registerPdaDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="tsx" setup>
  import { deletePda, getPda, getPdaById } from '@/api/configuration/pda';
  import { getFormConfig, getColumns, TableResult } from './data';
  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useGo } from '@/hooks/web/usePage';

  const PdaDrawer = createAsyncComponent(() => import('./Popup/PdaDrawer.vue'));

  defineOptions({
    name: 'PDA',
  });

  const go = useGo();
  const [registerPdaDrawer, { openDrawer: openPdaDrawer }] = useDrawer();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    api: (where) => getPda(where, null, true),
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
      auth: ['pda_edit', 'pda_del', 'pda_boxRule', 'pda_billInRule'],
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
            icon: 'fluent:box-16-regular',
            tooltip: '箱码校验规则',
            auth: 'pda_boxRule',
            onClick: async () => {
              const data = await getPdaById(record.id);
              go({
                path: `/configuration/pda/update_boxRule/${record.id}`,
                query: {
                  content: data.boxRule,
                  ruleType: 'PACKAGE',
                },
              });
            },
          },
          {
            icon: 'fluent:note-pin-20-regular',
            tooltip: '入库校验规则',
            auth: 'pda_billInRule',
            onClick: async () => {
              const data = await getPdaById(record.id);
              go({
                path: `/configuration/pda/update_billInRule/${record.id}`,
                query: {
                  content: data.billInRule,
                  ruleType: 'PACKAGE',
                },
              });
            },
          },
          {
            icon: 'clarity:note-edit-line',
            tooltip: '编辑',
            auth: 'pda_edit',
            onClick: async () => {
              const data = await getPdaById(record.id);
              openPdaDrawer(true, {
                actionKey: 'edit',
                record: data,
              });
            },
          },
          {
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: 'pda_del',
            popConfirm: {
              title: '是否确认删除？',
              placement: 'left',
              confirm: async () => {
                await deletePda([record.id]);
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
    openPdaDrawer(true, {
      actionKey: 'create',
    });
  };
</script>
