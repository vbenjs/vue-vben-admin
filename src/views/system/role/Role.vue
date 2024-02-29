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

      <template #bodyCell="{ text, record, column }">
        <template v-if="column.dataIndex === 'sysDefault'">
          <YNTag :text="text" />
        </template>
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                tooltip: '角色权限编辑',
                auth: 'accountRoleManager_edit',
                onClick: handleEdit.bind(null, record.id),
                ifShow: record.sysDefault !== 'Y',
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                auth: 'accountRoleManager_delete',
                popConfirm: {
                  title: '是否确认删除角色？',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record.id),
                },
                ifShow: record.sysDefault !== 'Y',
              },
            ]"
          />
        </template>
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
  import RoleDrawer from './RoleDrawer.vue';
  import YNTag from '@/components/Tag/YNTag.vue';

  defineOptions({ name: 'Role' });

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

  const handleEdit = async (id: number) => {
    const account = await getRoleById(id);
    openDrawer(true, {
      record: account,
      actionKey: 'edit',
    });
  };

  const handleDelete = (id: number) => {
    deleteRole(id).then(() => reload());
  };

  onMounted(() => {
    setColumns(getRoleColumns(getDataSource, setTableData));
  });
</script>
