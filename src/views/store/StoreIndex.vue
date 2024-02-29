<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'StoreManager_add'"
        >
          添加地点
        </a-button>
      </template>
    </BasicTable>

    <StoreDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="tsx" setup name="StoreIndex">
  import { getFormConfig, getColumns } from './data';
  import { StoreResult } from '@/api/model/storeModel';
  import { deleteStore, getStore, getStoreById } from '@/api/store';
  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { useGo } from '@/hooks/web/usePage';
  import { openWindow } from '@/utils';
  import { HashingFactory } from '@/utils/cipher';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  const StoreDrawer = createAsyncComponent(() => import('./Drawer/StoreDrawer.vue'));

  const [registerDrawer, { openDrawer }] = useDrawer();
  const go = useGo();
  const encryptByMd5 = HashingFactory.createMD5Hashing().hash;

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    api: (where) => getStore(where, true),
    title: '地点列表',
    columns: getColumns(),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    loading: true,
    showIndexColumn: false,
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
      auth: ['StoreManager_edit', 'StoreManager_del'],
      customRender: ({ record }) => {
        return createActions(record as StoreResult);
      },
    },
  });

  const createActions = (record: StoreResult) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'clarity:note-edit-line',
            tooltip: '编辑',
            auth: 'StoreManager_edit',
            onClick: handleEdit.bind(null, record.id),
          },
          {
            icon: 'ant-design:fund-projection-screen-outlined',
            tooltip: '数据大屏',
            onClick: () => {
              openWindow(
                import.meta.env.VITE_GLOB_API_URL +
                  '/store/screen/index.html?storeNumber=' +
                  record.storeNumber,
              );
            },
          },
          {
            icon: 'fluent:group-20-regular',
            tooltip: '分组统计',
            auth: 'StoreStatistics',
            onClick: () =>
              go({
                path: '/store/statistics/' + encryptByMd5(record.id + 'statistics'),
                query: {
                  storeId: record.id,
                  storeNumber: record.storeNumber,
                },
              }),
          },
        ]}
        dropDownActions={[
          {
            label: '营业额管理',
            auth: 'StoreTurnover',
            onClick: () =>
              go({
                path: '/store/turnover/' + encryptByMd5(record.id + 'turnover'),
                query: {
                  storeId: record.id,
                  storeNumber: record.storeNumber,
                  storeName: record.name,
                },
              }),
          },
          {
            icon: 'ant-design:delete-outlined',
            label: '删除',
            color: 'error',
            auth: 'StoreManager_del',
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
    const account = await getStoreById(id);
    openDrawer(true, {
      record: account,
      actionKey: 'edit',
    });
  };

  const handleDelete = async (id: number) => {
    await deleteStore(id);
    reload();
  };
</script>
