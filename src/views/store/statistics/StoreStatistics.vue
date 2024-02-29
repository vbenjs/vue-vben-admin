<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'StoreStatistics_add'"
        >
          添加分组
        </a-button>
      </template>
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'manager'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '分组设备',
                auth: 'StoreStatistics_equipment',
                onClick: handleEquipment.bind(null, record.id),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <StatisticsDrawer @register="registerDrawer" @success="handleSuccess" :storeId="storeId" />
    <EquipmentManager @register="registerEquipmentManagerDrawer" />
  </div>
</template>
<script lang="tsx" setup name="StoreStatistics">
  import { useRoute } from 'vue-router';
  import { getFormConfig, getColumns, groupStatistics } from './data';
  import { deleteStoreGroup, getStoreGroup, getStoreGroupById } from '@/api/group';
  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { onMounted, ref } from 'vue';
  import { useTabs } from '@/hooks/web/useTabs';

  const StatisticsDrawer = createAsyncComponent(() => import('./Drawer/StatisticsDrawer.vue'));
  const EquipmentManager = createAsyncComponent(() => import('./Drawer/EquipmentManager.vue'));

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerEquipmentManagerDrawer, { openDrawer: openEquipmentManagerDrawer }] = useDrawer();

  const route = useRoute();
  const { setTitle } = useTabs();

  const storeId = ref(0);

  onMounted(() => {
    storeId.value = Number(route.query.storeId);
    const storeNumber = route.query.storeNumber;
    setTitle(`${storeNumber}分组统计`);
  });

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    api: (where) => getStoreGroup(where, true),
    beforeFetch: (where) => {
      where.storeId = storeId.value;
      return where;
    },
    columns: getColumns(),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    loading: true,
    showIndexColumn: false,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      auth: ['StoreStatistics_edit', 'StoreStatistics_del'],
      customRender: ({ record }) => {
        return createActions(record);
      },
    },
  });

  const createActions = (record: Recordable) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'mdi:chart-line',
            tooltip: '分组统计',
            auth: 'StoreStatistics_chart',
            onClick: () => groupStatistics(record.id),
          },
          {
            icon: 'clarity:note-edit-line',
            tooltip: '编辑',
            auth: 'StoreStatistics_edit',
            onClick: handleEdit.bind(null, record.id),
          },
          {
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: 'StoreStatistics_del',
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
    const account = await getStoreGroupById(id);
    openDrawer(true, {
      record: account,
      actionKey: 'edit',
    });
  };

  const handleDelete = async (id: number) => {
    await deleteStoreGroup(id);
    reload();
  };

  const handleEquipment = async (id: number) => {
    openEquipmentManagerDrawer(true, {
      id,
      storeId: storeId.value,
    });
  };
</script>
