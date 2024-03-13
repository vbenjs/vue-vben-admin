<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'accountRoleManager_addRole'"
          >新建角色</a-button
        >
      </template>
    </BasicTable>

    <RoleDrawer @register="registerDrawer" @success="reload" />
  </div>
</template>
<script lang="tsx" setup>
  import { onMounted } from 'vue';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { getFormConfig, getRoleColumns } from './data';
  import { useDrawer } from '@/components/Drawer';
  import { deleteRole, getRole, getRoleById } from '@/api/system/roles';
  import { RoleResult } from '@/ApiModel/system/roleModel';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  defineOptions({ name: 'Role' });

  const RoleDrawer = createAsyncComponent(() => import('./RoleDrawer.vue'));

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload, setColumns, getDataSource, setTableData }] = useTable({
    title: '角色列表',
    api: (where) => getRole(where, true),
    beforeFetch: (where) => {
      return {
        ...where,
        field: 'sortNum',
        order: 'desc',
      };
    },
    rowKey: 'id',
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      auth: ['accountRoleManager_edit', 'accountRoleManager_delete'],
      customRender: ({ record }) => {
        return createActions(record as RoleResult);
      },
    },
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    loading: true,
    showIndexColumn: false,
  });

  const handleCreate = () => {
    openDrawer(true, {
      actionKey: 'create',
      sortNum: getDataSource().length + 1,
    });
  };

  onMounted(() => {
    setColumns(getRoleColumns(getDataSource, setTableData));
  });

  const createActions = (record: RoleResult) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'clarity:note-edit-line',
            tooltip: '角色权限编辑',
            auth: 'accountRoleManager_edit',
            onClick: async () => {
              const account = await getRoleById(record.id);
              openDrawer(true, {
                record: account,
                actionKey: 'edit',
              });
            },
            ifShow: record.sysDefault !== 'Y',
          },
          {
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: 'accountRoleManager_delete',
            popConfirm: {
              title: '是否确认删除角色？',
              placement: 'left',
              confirm: () => deleteRole(record.id).then(() => reload()),
            },
            ifShow: record.sysDefault !== 'Y',
          },
        ]}
      />
    );
  };
</script>
