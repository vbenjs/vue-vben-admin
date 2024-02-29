<template>
  <div>
    <BasicTable @register="registerTable" :showSorterTooltip="false">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'RemindTemplate_add'"
        >
          新建
        </a-button>
      </template>
    </BasicTable>

    <TemplateDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="tsx" setup name="SensorIndex">
  import { defineAsyncComponent } from 'vue';
  import { getFormConfig, getColumns } from './data';
  import { SensorResult } from '@/api/model/sensorModel';
  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';

  import { YN } from '@/enums/YN';
  import { getRemindTemplate, deleteRemindTemplate } from '@/api/remind/template';

  const TemplateDrawer = defineAsyncComponent(() => import('./TemplateDrawer.vue'));

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    api: (where) => getRemindTemplate(where, YN.N, true),
    columns: getColumns(),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    loading: true,
    showIndexColumn: false,
    defSort: {
      columnKey: 'sortNum',
      order: 'descend',
    },
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      auth: ['RemindTemplate_edit', 'RemindTemplate_del'],
      customRender: ({ record }) => {
        return createActions(record as SensorResult);
      },
    },
  });

  const createActions = (record: SensorResult) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'ant-design:eye-outlined',
            tooltip: '查看',
            auth: 'RemindTemplate_show',
            onClick: async () => {
              openDrawer(true, {
                id: record.id,
                actionKey: 'show',
              });
            },
          },
          {
            icon: 'clarity:note-edit-line',
            tooltip: '编辑',
            auth: 'RemindTemplate_edit',
            onClick: async () => {
              openDrawer(true, {
                id: record.id,
                actionKey: 'edit',
              });
            },
          },
        ]}
        dropDownActions={[
          {
            icon: 'akar-icons:copy',
            label: '拷贝',
            auth: 'RemindTemplate_copy',
            onClick: async () => {
              openDrawer(true, {
                id: record.id,
                actionKey: 'copy',
              });
            },
          },
          {
            icon: 'ant-design:delete-outlined',
            label: '删除',
            color: 'error',
            auth: 'RemindTemplate_del',
            popConfirm: {
              title: '是否确认删除？',
              placement: 'left',
              confirm: async () => {
                await deleteRemindTemplate([record.id]);
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
    openDrawer(true, {
      actionKey: 'create',
    });
  };
</script>
