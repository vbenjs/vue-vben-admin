<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="route.query.permissionCode + '_add'"
        >
          添加告警
        </a-button>
      </template>
    </BasicTable>

    <RemindConfigDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="tsx" setup name="AlarmEquipment">
  import { useRoute } from 'vue-router';
  import { getColumns, getFormConfig } from '../../setting/data';
  import { deleteRemindConfig, getRemindConfig } from '@/api/remind/config';
  import { RemindConfigResult } from '@/api/remind/model/config';
  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { YN } from '@/enums/YN';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  const RemindConfigDrawer = createAsyncComponent(
    () => import('../../setting/Drawer/RemindConfigDrawer.vue'),
  );

  const route = useRoute();

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    api: (params) => getRemindConfig(params, YN.N, true),
    beforeFetch: (params) => {
      params.equipmentId = route.query.equipmentId;
      params.equipmentType = route.query.equipmentType;
      return params;
    },
    columns: getColumns({
      isEquipment: true,
      permissionCode: route.query.permissionCode + '_update',
    }),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig({ isEquipment: true }),
    showTableSetting: true,
    loading: true,
    showIndexColumn: false,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      customRender: ({ record }) => {
        return createActions(record as RemindConfigResult);
      },
    },
  });

  const createActions = (record: RemindConfigResult) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'ant-design:eye-outlined',
            tooltip: '查看',
            auth: route.query.permissionCode + '_show',
            onClick: () => {
              openDrawer(true, {
                id: record.id,
                actionKey: 'show',
              });
            },
          },
          {
            icon: 'clarity:note-edit-line',
            tooltip: '编辑',
            auth: route.query.permissionCode + '_edit',
            onClick: () => {
              openDrawer(true, {
                id: record.id,
                actionKey: 'edit',
              });
            },
          },
          {
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: route.query.permissionCode + '_del',
            popConfirm: {
              title: '是否确认删除？',
              placement: 'left',
              confirm: async () => {
                await deleteRemindConfig([record.id]);
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
      equipmentId: route.query.equipmentId,
      equipmentType: route.query.equipmentType,
      equipment: JSON.parse(route.query.equipment as string),
    });
  };
</script>
