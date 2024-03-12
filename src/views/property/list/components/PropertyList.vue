<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="`${props.auth}_add`"
        >
          添加品牌
        </a-button>
      </template>
    </BasicTable>

    <PropertyFormDrawer @register="registerPropertyFormDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="tsx" setup>
  import { getFormConfig, getColumns, TableResult } from './data';
  import { deleteStore, getStore, getStoreById } from '@/api/store';
  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  defineOptions({ name: 'PropertyList' });

  const PropertyFormDrawer = createAsyncComponent(() => import('./Drawer/PropertyFormDrawer.vue'));

  interface Props {
    auth: string;
  }

  const props = withDefaults(defineProps<Props>(), {});

  const [registerPropertyFormDrawer, { openDrawer: openPropertyFormDrawer }] = useDrawer();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    api: (where) => getStore(where, true),
    columns: getColumns(props.auth),
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
      auth: [`${props.auth}_edit`, `${props.auth}_del`],
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
            auth: `${props.auth}_edit`,
            onClick: handleEdit.bind(null, record.id),
          },
          {
            icon: 'ant-design:delete-outlined',
            tooltip: '删除',
            color: 'error',
            auth: `${props.auth}_del`,
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
    openPropertyFormDrawer(true, {
      actionKey: 'create',
    });
  };

  const handleEdit = async (id: number) => {
    const account = await getStoreById(id);
    openPropertyFormDrawer(true, {
      record: account,
      actionKey: 'edit',
    });
  };

  const handleDelete = async (id: number) => {
    await deleteStore(id);
    reload();
  };
</script>
