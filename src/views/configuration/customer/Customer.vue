<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'customer_add'"
        >
          新建
        </a-button>
      </template>
    </BasicTable>

    <CustomerDrawer @register="registerCustomerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="tsx" setup>
  import { deleteCustomer, getCustomer, getCustomerById } from '@/api/configuration/customer';
  import { getFormConfig, getColumns, TableResult } from './data';
  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useGo } from '@/hooks/web/usePage';

  const CustomerDrawer = createAsyncComponent(() => import('./Popup/CustomerDrawer.vue'));

  defineOptions({ name: 'Customer' });

  const go = useGo();
  const [registerCustomerDrawer, { openDrawer: openCustomerDrawer }] = useDrawer();
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    api: (where) => getCustomer(where, null, true),
    columns: getColumns(),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),

    loading: true,
    showIndexColumn: false,
    showTableSetting: true,
    actionColumn: {
      width: 140,
      title: '操作',
      dataIndex: 'action',
      auth: ['customer_edit', 'customer_del'],
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
            auth: 'customer_edit',
            onClick: async () => {
              const data = await getCustomerById(record.id);
              openCustomerDrawer(true, {
                actionKey: 'edit',
                record: data,
              });
            },
          },
          {
            icon: 'bx:link',
            tooltip: '关系管理',
            auth: 'customer_relation',
            onClick: async () => {
              go({ path: `/configuration/customer/relation/${record.id}` });
            },
          },
          {
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: 'customer_del',
            popConfirm: {
              title: '是否确认删除？',
              placement: 'left',
              confirm: async () => {
                await deleteCustomer([record.id]);
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
    openCustomerDrawer(true, {
      actionKey: 'create',
    });
  };
</script>
