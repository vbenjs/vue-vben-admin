<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增角色 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'ant-design:edit-outlined',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <RoleDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup name="角色管理">
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import RoleDrawer from './RoleDrawer.vue';
  import { getRoleList, deleteRole } from '/@/api/system/role';
  import { columns, searchFormSchema } from './role.data';

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload }] = useTable({
    title: '角色列表',
    api: getRoleList,
    columns,
    formConfig: {
      labelWidth: 60,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,
    showTableSetting: true,
    pagination: false,
    bordered: true,
    showIndexColumn: false,
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',

      fixed: undefined,
    },
  });

  function handleCreate() {
    openDrawer(true, {
      isUpdate: false,
    });
  }

  async function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
    });
  }

  async function handleDelete(record: Recordable) {
    await deleteRole(record.id);
    reload();
  }

  function handleSuccess() {
    reload();
  }
</script>
