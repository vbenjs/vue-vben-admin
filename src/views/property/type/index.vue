<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="`${AUTH_KEY}_add`"
        >
          添加分类
        </a-button>
      </template>
    </BasicTable>

    <TypeFormDrawer @register="registerTypeFormDrawer" />
  </div>
</template>
<script lang="tsx" setup>
  import { getFormConfig, getColumns, AUTH_KEY, TableResult } from './data';
  import { deleteStore, getStore, getStoreById } from '@/api/store';
  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { useMessage } from '@/hooks/web/useMessage';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  defineOptions({ name: AUTH_KEY });

  const TypeFormDrawer = createAsyncComponent(() => import('./Drawer/TypeFormDrawer.vue'));

  const [registerTypeFormDrawer, { openDrawer: openTypeFormDrawer }] = useDrawer();
  const { createMessage: message } = useMessage();

  const [registerTable, { reload }] = useTable({
    api: (where) => getStore(where, true),
    columns: getColumns(),
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
      auth: [`${AUTH_KEY}_edit`, `${AUTH_KEY}_del`],
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
            auth: `${AUTH_KEY}_edit`,
            onClick: async () => {
              const data = await getStoreById(record.id);
              openTypeFormDrawer(true, {
                actionKey: 'edit',
                record: data,
              });
            },
          },
          {
            icon: 'ant-design:delete-outlined',
            tooltip: '删除',
            color: 'error',
            auth: `${AUTH_KEY}_del`,
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

  const handleCreate = () => {
    openTypeFormDrawer(true, {
      actionKey: 'create',
    });
  };

  const handleDelete = async (id: number) => {
    await deleteStore(id);
    reload();
  };
</script>
