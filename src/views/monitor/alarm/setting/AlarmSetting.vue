<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'AlarmSetting_add'"
        >
          添加告警
        </a-button>
      </template>
    </BasicTable>

    <RemindConfigDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="tsx" setup>
  import { getFormConfig, getColumns } from './data';
  import { deleteRemindConfig, getRemindConfig } from '@/api/remind/config';
  import { RemindConfigResult } from '@/api/remind/model/config';
  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { YN } from '@/enums/YN';
  import { useGo } from '@/hooks/web/usePage';
  import { HashingFactory } from '@/utils/cipher';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useFormat } from '@/utils/format';

  defineOptions({ name: 'AlarmSetting' });

  const RemindConfigDrawer = createAsyncComponent(() => import('./Drawer/RemindConfigDrawer.vue'));
  const go = useGo();
  const { formatStore } = useFormat();

  const encryptByMd5 = HashingFactory.createMD5Hashing().hash;

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    api: (where) => getRemindConfig(where, YN.N, true),
    columns: getColumns({ permissionCode: 'AlarmSetting_update' }),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    loading: true,
    showIndexColumn: false,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      auth: ['AlarmSetting_edit', 'AlarmSetting_del', 'AlarmSetting_show'],
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
            tooltip: {
              title: '查看',
              placement: 'top',
              mouseEnterDelay: 2,
            },
            auth: 'AlarmSetting_show',
            onClick: async () => {
              openDrawer(true, {
                id: record.id,
                actionKey: 'show',
              });
            },
          },
          {
            icon: 'clarity:note-edit-line',
            tooltip: {
              title: '编辑',
              placement: 'top',
              mouseEnterDelay: 2,
            },
            auth: 'AlarmSetting_edit',
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
            auth: 'AlarmSetting_copy',
            onClick: async () => {
              openDrawer(true, {
                id: record.id,
                actionKey: 'copy',
              });
            },
          },
          {
            icon: 'ant-design:file-search-outlined',
            label: '告警记录',
            auth: 'AlarmRecord',
            onClick: () => {
              const id = encryptByMd5(record.equipmentId + record.equipmentType);
              go({
                path: '/alarm/equipment/' + id,
                query: {
                  equipmentId: record.id,
                  equipmentType: record.equipmentType,
                  equipmentName: record.equipmentName,
                  store: formatStore(record.store),
                  permissionCode: 'AlarmRecord',
                  default: 'record',
                },
              });
            },
          },
          {
            icon: 'ant-design:delete-outlined',
            label: '删除',
            color: 'error',
            auth: 'AlarmSetting_del',
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
    });
  };
</script>
