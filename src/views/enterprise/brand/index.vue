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
          添加品牌
        </a-button>
      </template>
    </BasicTable>

    <BrandFormDrawer @register="registerBrandFormDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="tsx" setup>
  import { getFormConfig, getColumns, AUTH_KEY, TableResult } from './data';
  import { deleteCompany, getCompany, getCompanyById } from '@/api/company/company';
  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  defineOptions({ name: AUTH_KEY });

  const BrandFormDrawer = createAsyncComponent(() => import('./Drawer/BrandFormDrawer.vue'));

  const [registerBrandFormDrawer, { openDrawer: openBrandFormDrawer }] = useDrawer();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    api: (where) => getCompany(where, true),
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
              const account = await getCompanyById(record.id);
              openBrandFormDrawer(true, {
                record: account,
                actionKey: 'edit',
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
              confirm: async () => {
                await deleteCompany([record.id]);
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
    openBrandFormDrawer(true, {
      actionKey: 'create',
    });
  };
</script>
