<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'barcodeRule_add'"
        >
          新建
        </a-button>
      </template>
    </BasicTable>

    <BarcodeRulesDrawer @register="registerBarcodeRulesDrawer" @success="handleSuccess" />
    <OtherManagerDrawer @register="registerOtherManagerDrawer" />
  </div>
</template>
<script lang="tsx" setup>
  import {
    deleteBarcodeRule,
    getBarcodeRule,
    getBarcodeRuleById,
  } from '@/api/configuration/barcodeRule';
  import { getFormConfig, getColumns, TableResult } from './data';
  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useGo } from '@/hooks/web/usePage';

  defineOptions({ name: 'Barcode' });

  const BarcodeRulesDrawer = createAsyncComponent(() => import('./Popup/BarcodeRulesDrawer.vue'));
  const OtherManagerDrawer = createAsyncComponent(() => import('./Popup/OtherManagerDrawer.vue'));

  const go = useGo();
  const [registerBarcodeRulesDrawer, { openDrawer: openBarcodeRulesDrawer }] = useDrawer();
  const [registerOtherManagerDrawer, { openDrawer: openOtherManagerDrawer }] = useDrawer();
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    api: (where) => getBarcodeRule(where, null, true),
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
      auth: ['barcodeRule_edit', 'barcodeRule_del'],
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
            auth: 'barcodeRule_edit',
            onClick: async () => {
              const data = await getBarcodeRuleById(record.id);
              openBarcodeRulesDrawer(true, {
                actionKey: 'edit',
                record: data,
              });
            },
          },
          {
            icon: 'bx:link',
            tooltip: '绑定其他',
            auth: 'barcodeRule_other',
            onClick: async () => {
              openOtherManagerDrawer(true, record.id);
            },
            ifShow: record.ruleType !== 'OTHER',
          },
          {
            icon: 'ant-design:file-text-outlined',
            tooltip: '更新生成规则',
            auth: 'barcodeRule_updateContent',
            onClick: async () => {
              const data = await getBarcodeRuleById(record.id);
              go({
                path: `/configuration/barcode/update/${record.id}`,
                query: {
                  content: data.content,
                  ruleType: data.ruleType,
                },
              });
            },
          },
          {
            icon: 'codicon:verified',
            tooltip: '更新校验规则',
            auth: 'barcodeRule_updateVerify',
            onClick: async () => {
              const data = await getBarcodeRuleById(record.id);
              go({
                path: `/configuration/barcode/update_verify/${record.id}`,
                query: {
                  content: data.verify,
                  ruleType: data.ruleType,
                },
              });
            },
          },
          {
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: 'barcodeRule_del',
            popConfirm: {
              title: '是否确认删除？',
              placement: 'left',
              confirm: async () => {
                await deleteBarcodeRule([record.id]);
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
    openBarcodeRulesDrawer(true, {
      actionKey: 'create',
    });
  };
</script>
