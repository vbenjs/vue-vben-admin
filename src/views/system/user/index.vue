<script lang="ts" setup>
  import { ref, unref } from 'vue';

  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';

  import { YesNo } from '/@/enums/YesNo';

  import { listUsers, deleteUser } from '/@/apis/users';
  import DepartmentTree from '../department/DepartmentTree.vue';
  import UserModal from './UserModal.vue';
  import UserDepartmentDrawer from './UserDepartmentDrawer.vue';
  import UserRoleDrawer from './UserRoleDrawer.vue';
  import { columns, searchFormSchema } from './user.data';
  const departmentId = ref<Nullable<number>>(null);

  function handleDepartmentSelect(selectedKeys: number[]) {
    departmentId.value = selectedKeys[0] || null;
    reload();
  }
  const [registerModal, { openModal }] = useModal();
  const [registerDepartmentDrawer, { openDrawer: openDepartmentDrawer }] = useDrawer();
  const [registerRoleDrawer, { openDrawer: openRoleDrawer }] = useDrawer();
  const [registerTable, { reload }] = useTable({
    title: '账号列表',
    columns,
    rowKey: 'id',
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,
    showTableSetting: true,
    canResize: false,
    bordered: true,
    api: (args) => {
      return listUsers({ ...args, departmentId: unref(departmentId) });
    },
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
    },
  });
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }
  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
    });
  }
  function handleDepartmentSetting(record: Recordable) {
    openDepartmentDrawer(true, record);
  }
  function handleRoleSetting(record: Recordable) {
    openRoleDrawer(true, record);
  }
  async function handleDelete(record: Recordable) {
    await deleteUser(record.id);
    reload();
  }
  function handleSuccess() {
    reload();
  }
</script>
<template>
  <page-wrapper dense content-full-height fixed-height content-class="flex">
    <department-tree class="w-1/4 xl:w-1/5" toolbar search @select="handleDepartmentSelect" />
    <basic-table @register="registerTable" class="w-3/4 xl:w-4/5">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">新增账号</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <table-action
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑',
                ifShow: record.isSystemic === YesNo.NO,
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'mingcute:department-line',
                tooltip: '部门配置',
                ifShow: record.isSystemic === YesNo.NO,
                onClick: handleDepartmentSetting.bind(null, record),
              },
              {
                icon: 'eos-icons:role-binding-outlined',
                tooltip: '角色配置',
                ifShow: record.isSystemic === YesNo.NO,
                onClick: handleRoleSetting.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除',
                ifShow: record.isSystemic === YesNo.NO,
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
    </basic-table>
    <user-modal @register="registerModal" @success="handleSuccess" />
    <user-department-drawer @register="registerDepartmentDrawer" />
    <user-role-drawer @register="registerRoleDrawer" />
  </page-wrapper>
</template>
