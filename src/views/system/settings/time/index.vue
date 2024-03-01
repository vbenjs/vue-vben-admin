<template>
  <div>
    <BasicTable @register="registerTable" :showSorterTooltip="false">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'BusinessTime_add'"
        >
          新建
        </a-button>
      </template>
    </BasicTable>

    <TimeDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="tsx" setup>
  import { defineAsyncComponent } from 'vue';
  import { getFormConfig, getColumns } from './data';
  import { SensorResult } from '@/api/model/sensorModel';
  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';

  import { deleteBusinessTime, getBusinessTime, getBusinessTimeById } from '@/api/businessTime';
  import { YN } from '@/enums/YN';

  defineOptions({ name: 'BusinessTime' });

  const TimeDrawer = defineAsyncComponent(() => import('./TimeDrawer.vue'));

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    api: (where) => getBusinessTime(where, YN.N, true),
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
      width: 80,
      title: '操作',
      dataIndex: 'action',
      auth: ['BusinessTime_edit', 'BusinessTime_del'],
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
            icon: 'clarity:note-edit-line',
            tooltip: '编辑',
            auth: 'BusinessTime_edit',
            onClick: handleEdit.bind(null, record.id),
          },
          {
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: 'BusinessTime_del',
            popConfirm: {
              title: '是否确认删除？',
              placement: 'left',
              confirm: handleDelete.bind(null, record.id),
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

  const handleEdit = async (id: number) => {
    const data = await getBusinessTimeById(id);
    openDrawer(true, {
      record: data,
      actionKey: 'edit',
    });
  };

  const handleDelete = async (id: number) => {
    await deleteBusinessTime([id]);
    reload();
  };
</script>
