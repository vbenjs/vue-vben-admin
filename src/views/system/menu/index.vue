<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <div class="flex-1 flex gap-2 ml-2">
          <a-button @click="expandAll">展开全部</a-button>
          <a-button @click="collapseAll">折叠全部</a-button>
        </div>
        <a-button type="primary" @click="handleCreate"> 新增菜单 </a-button>
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
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup name="菜单管理">
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import MenuDrawer from './MenuDrawer.vue';
  import { getMenuList, deleteMenu } from '/@/api/system/menu';
  import { columns, searchFormSchema } from './menu.data';

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload, expandAll, collapseAll }] = useTable({
    title: '菜单列表',
    api: getMenuList,
    columns,
    formConfig: {
      labelWidth: 80,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    isTreeTable: true,
    pagination: false,
    striped: false,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    canResize: false,
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',

      fixed: undefined,
    },
    rowKey: 'id',
  });

  function handleCreate() {
    openDrawer(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
    });
  }

  async function handleDelete(record: Recordable) {
    await deleteMenu(record.id);
    reload();
  }

  function handleSuccess() {
    reload();
  }

  function onFetchSuccess() {
    // nextTick(expandAll);
  }
</script>
