<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增菜单 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              ...(record.type !== 'btn'
                ? [
                    {
                      icon: 'streamline:add-circle-solid',
                      onClick: handleCreateSub.bind(null, record),
                    },
                  ]
                : []),
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
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
<script lang="ts" setup>
  import { nextTick } from 'vue';

  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { getMenuList } from '@/api/menu';

  import { useDrawer } from '@/components/Drawer';
  import MenuDrawer from './MenuDrawer.vue';
  import { usePermission } from '@/hooks/web/usePermission';
  import { useMessage } from '@/hooks/web/useMessage';

  import { columns, searchFormSchema } from './menu.data';

  defineOptions({ name: 'MenuManagement' });

  const { hasPermission } = usePermission();
  const { createMessage } = useMessage();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload, expandAll }] = useTable({
    title: '菜单列表',
    api: getMenuList,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
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
      width: 120,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
      fixed: undefined,
    },
  });

  function handleCreate() {
    openDrawer(true, {
      isUpdate: false,
    });
  }
  function handleCreateSub(record: Recordable) {
    openDrawer(true, {
      record: {
        type: record.type === 'dir' ? 'menu' : 'btn',
        parentMenuId: record.id,
      },
      isUpdate: false,
    });
  }

  function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
    });
  }

  function handleDelete(record: Recordable) {
    if (!hasPermission('sys:menu:del')) {
      createMessage.error('没有删除权限');
      return;
    }
    console.log(record);
  }

  function handleSuccess() {
    reload();
  }

  function onFetchSuccess() {
    // 演示默认展开所有表项
    nextTick(expandAll);
  }
</script>
