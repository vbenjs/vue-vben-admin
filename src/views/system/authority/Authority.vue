<template>
  <div class="m-4">
    <BasicTable @register="registerTable" :pagination="false" expandRowByClick>
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'permissionManager_add'"
          >新建</a-button
        >
        <ApiButton
          preIcon="ant-design:sync-outlined"
          :api="handleResetAuth"
          v-auth="'permissionManager_reset'"
          :confirmConfig="{ content: '是否确认重置权限？' }"
          >重置权限
        </ApiButton>
      </template>
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑',
                auth: 'permissionManager_edit',
                onClick: handleEdit.bind(null, record.id),
              },
              {
                icon: 'clarity:key-line',
                tooltip: '权限管理',
                auth: 'permissionManager_showAction',
                onClick: handleActionManager.bind(null, record.id),
              },
              {
                label: 'Json',
                tooltip: 'Json编辑',
                auth: 'permissionManager_json',
                onClick: handleJsonEdit.bind(null, record.id),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                auth: 'permissionManager_del',
                popConfirm: {
                  title: '是否确认删除？',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record.id),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <AuthDrawer @register="registerDrawer" @success="handleSuccess" />
    <EditWithJson @register="registerJsonDrawer" @success="reload" />
    <ActionManagerDrawer @register="register" />
  </div>
</template>
<script lang="tsx" setup name="Authority">
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { useDrawer } from '@/components/Drawer';
  import { useMessage } from '@/hooks/web/useMessage';
  import {
    deletePermission,
    getPermissionById,
    getPermissionTree,
    resetAuth,
  } from '@/api/system/permission';
  import { ApiButton } from '@/components/Button';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  const EditWithJson = createAsyncComponent(() => import('./drawer/EditWithJson.vue'));
  const AuthDrawer = createAsyncComponent(() => import('./drawer/AuthDrawer.vue'));
  const ActionManagerDrawer = createAsyncComponent(
    () => import('./drawer/ActionManagerDrawer.vue'),
  );

  const { createMessage: msg } = useMessage();
  const [registerDrawer, { openDrawer: openAuthDrawer }] = useDrawer();
  const [register, { openDrawer }] = useDrawer();
  const [registerJsonDrawer, { openDrawer: openJsonDrawer }] = useDrawer();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '权限树',
    api: getPermissionTree,
    rowKey: 'id',
    columns: [
      { title: '权限名称', dataIndex: 'permissionName', align: 'left' },
      {
        title: '权限编码',
        dataIndex: 'permissionCode',
        width: '150px',
        fixed: 'right',
      },
      { title: '排序', dataIndex: 'sortNum', width: '90px', fixed: 'right' },
    ],
    isTreeTable: true,
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
      auth: [
        'permissionManager_edit',
        'permissionManager_del',
        'permissionManager_showAction',
        'permissionManager_json',
      ],
    },
    showTableSetting: true,
    tableSetting: { setting: false },
    loading: true,
    showIndexColumn: false,
  });

  const handleCreate = () => {
    openAuthDrawer(true, {
      actionKey: 'create',
    });
  };

  const handleEdit = async (id: number) => {
    const permission = await getPermissionById(id);
    openAuthDrawer(true, {
      record: {
        ...permission,
        parentId: permission.parentId === 0 ? undefined : permission.parentId,
      },
      actionKey: 'edit',
    });
  };
  const handleJsonEdit = async (id: number) => {
    openJsonDrawer(true, id);
  };
  const handleActionManager = async (id: number) => {
    openDrawer(true, id);
  };

  const handleDelete = (id: number) => {
    deletePermission([id]).then(() => reload());
  };
  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  }
  const handleResetAuth = async () => {
    await resetAuth();
    msg.success('重置成功！');
    await reload();
  };
</script>
