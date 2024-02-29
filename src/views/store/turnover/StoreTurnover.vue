<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'StoreTurnover_add'"
        >
          添加明细
        </a-button>
      </template>
    </BasicTable>

    <TurnoverDrawer @register="registerDrawer" @success="handleSuccess" :storeId="storeId" />
  </div>
</template>
<script lang="tsx" setup name="StoreTurnover">
  import { useRoute } from 'vue-router';
  import { getFormConfig, getColumns } from './data';
  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { onMounted, ref } from 'vue';
  import { useTabs } from '@/hooks/web/useTabs';
  import { useFormat } from '@/utils/format';
  import {
    deleteStorePowerMonth,
    getStorePowerMonth,
    getStorePowerMonthById,
  } from '@/api/storePowerMonth';

  const TurnoverDrawer = createAsyncComponent(() => import('./Drawer/TurnoverDrawer.vue'));

  const [registerDrawer, { openDrawer }] = useDrawer();

  const route = useRoute();
  const { setTitle } = useTabs();
  const { formatStore } = useFormat();

  const storeId = ref(0);

  onMounted(() => {
    storeId.value = Number(route.query.storeId);
    setTitle(`月度电量及营业额明细（${formatStore(route.query as any)}）`);
  });

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    api: (where) => getStorePowerMonth(where, true),
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
      auth: ['StoreTurnover_edit', 'StoreTurnover_del'],
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
            icon: 'clarity:note-edit-line',
            tooltip: '编辑',
            auth: 'StoreTurnover_edit',
            onClick: handleEdit.bind(null, record.id),
          },
          {
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: 'StoreTurnover_del',
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
    const account = await getStorePowerMonthById(id);
    openDrawer(true, {
      record: account,
      actionKey: 'edit',
    });
  };

  const handleDelete = async (id: number) => {
    await deleteStorePowerMonth([id]);
    reload();
  };
</script>
