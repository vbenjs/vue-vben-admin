<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'EquipmentManager_add'"
        >
          添加设备
        </a-button>
      </template>
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'settings'">
          <TableAction
            stopButtonPropagation
            :actions="createOtherActions(record as EquipmentResult)"
          />
        </template>
      </template>
    </BasicTable>

    <EquipmentDrawer @register="registerDrawer" @success="handleSuccess" />
    <AttributeDrawer @register="registerAttributeDrawer" />
  </div>
</template>
<script lang="tsx" setup>
  import { getFormConfig, getColumns } from './data';
  import { deleteEquipment, getEquipment, getEquipmentById } from '@/api/equipment';
  import { EquipmentResult } from '@/api/model/equipmentModel';
  import { useDrawer } from '@/components/Drawer';
  import { ActionItem, BasicTable, TableAction, useTable } from '@/components/Table';
  import { useGo } from '@/hooks/web/usePage';
  import { HashingFactory } from '@/utils/cipher';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useFormat } from '@/utils/format';
  import { createEquipmentStatistics } from '@/views/common/Modals/statistics/index';

  defineOptions({ name: 'EquipmentCustom' });

  const EquipmentDrawer = createAsyncComponent(() => import('./Drawer/EquipmentDrawer.vue'));
  const AttributeDrawer = createAsyncComponent(() => import('./Drawer/AttributeDrawer.vue'));

  const encryptByMd5 = HashingFactory.createMD5Hashing().hash;

  const { formatStore } = useFormat();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerAttributeDrawer, { openDrawer: openAttributeDrawer }] = useDrawer();
  const go = useGo();
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    api: (where) => getEquipment(where, true),
    title: '自定义设备列表',
    columns: getColumns(),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    tableSetting: { export: true },
    loading: true,
    showIndexColumn: false,
    actionColumn: {
      width: 140,
      title: '操作',
      dataIndex: 'action',
      auth: ['EquipmentManager_edit', 'EquipmentManager_del'],
      customRender: ({ record }) => {
        return createActions(record as EquipmentResult);
      },
    },
  });

  const createActions = (record: EquipmentResult) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'mdi:chart-line',
            tooltip: '数据统计',
            auth: 'EquipmentManager_chart',
            onClick: () => {
              createEquipmentStatistics({
                title: `数据统计（${record.equipmentName}）`,
                equipmentIds: [record.id],
              });
            },
          },
          {
            icon: 'clarity:note-edit-line',
            tooltip: '编辑',
            auth: 'EquipmentManager_edit',
            onClick: handleEdit.bind(null, record.id),
          },
          {
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: 'EquipmentManager_del',
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
  const createOtherActions = (record: EquipmentResult): ActionItem[] => {
    return [
      {
        icon: 'ic:outline-sensors',
        tooltip: '传感器',
        auth: 'EquipmentSensor',
        onClick: () =>
          go({
            path: '/equipment/custom_sensor/' + record.id,
            query: {
              equipmentId: record.id,
              equipmentName: record.equipmentName,
              storeId: record.store?.id,
            },
          }),
      },
      {
        icon: 'tabler:list-details',
        tooltip: '属性',
        auth: 'EquipmentManager_attr',
        onClick: () => {
          openAttributeDrawer(true, {
            equipmentId: record.id,
          });
        },
      },
      {
        icon: 'icon-park-outline:alarm',
        tooltip: '告警设置',
        auth: 'CustomAlarm',
        onClick: () => {
          const id = encryptByMd5(record.id + 'CUSTOM');
          go({
            path: '/alarm/equipment/' + id,
            query: {
              equipmentId: record.id,
              equipmentType: 'CUSTOM',
              equipmentName: record.equipmentName,
              store: formatStore(record.store),
              permissionCode: 'CustomAlarm',
              equipment: JSON.stringify(record),
            },
          });
        },
      },
    ];
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
    const account = await getEquipmentById(id);
    openDrawer(true, {
      record: account,
      actionKey: 'edit',
    });
  };

  const handleDelete = async (id: number) => {
    await deleteEquipment([id]);
    reload();
  };
</script>
