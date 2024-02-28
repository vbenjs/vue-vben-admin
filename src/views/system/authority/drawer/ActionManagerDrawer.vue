<template>
  <BasicDrawer title="权限管理" @register="register" :width="720" destroyOnClose>
    <BasicTable @register="registerTable" :pagination="false" expandRowByClick>
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'permissionManager_add'"
          >新建</a-button
        >
      </template>

      <template #bodyCell="{ text, record, column }">
        <template v-if="column.dataIndex === 'defaultCheck'">
          <YNTag :text="text" />
        </template>
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

    <EditWithJson @register="registerJsonModal" type="action" />
    <ActionFormDrawer @register="registerDrawer" @success="handleSuccess" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { BasicDrawer, useDrawer, useDrawerInner } from '@/components/Drawer';
  import { ref, unref } from 'vue';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { deleteAction, getActionById, getActions } from '@/api/system/permission';
  import YNTag from '@/components/Tag/YNTag.vue';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  const EditWithJson = createAsyncComponent(() => import('./EditWithJson.vue'));
  const ActionFormDrawer = createAsyncComponent(() => import('./ActionFormDrawer.vue'));

  const rowId = ref(0);
  const [registerJsonModal, { openDrawer: openJsonModal }] = useDrawer();
  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '权限列表',
    api: () => getActions(unref(rowId)),
    rowKey: 'id',
    columns: [
      { title: '操作名称', dataIndex: 'actionName' },
      { title: '操作编码', dataIndex: 'actionCode', width: 100 },
      { title: '必选', dataIndex: 'defaultCheck', width: 100 },
      { title: '排序', dataIndex: 'sortNum', width: 100 },
    ],
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      auth: ['permissionManager_edit', 'permissionManager_json', 'permissionManager_del'],
    },
    // showTableSetting: true,
    // loading: true,
    showIndexColumn: false,
  });

  const [register] = useDrawerInner(async (data) => {
    rowId.value = data;
  });

  const handleCreate = () => {
    openDrawer(true, {
      actionKey: 'create',
      record: { permissionId: unref(rowId) },
    });
  };

  const handleEdit = async (id: number) => {
    const data = await getActionById(id);
    openDrawer(true, { actionKey: 'edit', record: data });
  };
  const handleJsonEdit = async (id: number) => {
    openJsonModal(true, id);
  };

  const handleDelete = (id: number) => {
    deleteAction([id]).then(() => reload());
  };
  const handleSuccess = ({ actionKey, values }) => {
    if (actionKey === 'edit') {
      updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  };
</script>
