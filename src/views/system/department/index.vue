<script lang="ts" setup>
  import { BasicTable, TableAction, useTable } from '/@/components/Table';

  import { YesNo } from '/@/enums/YesNo';

  import { useModal } from '/@/components/Modal';
  import DepartmentModal from './DepartmentModal.vue';
  import { listDepartmentTree, deleteDepartment } from '/@/apis/departments';
  import { columns } from './department.data';
  const [registerTable, { reload }] = useTable({
    title: '部门列表',
    columns: columns,
    api: listDepartmentTree,
    pagination: false,
    striped: false,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    canResize: false,
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
      fixed: undefined,
    },
  });
  const [registerModal, { openModal }] = useModal();
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }
  function handleEdit(record: Recordable) {
    openModal(true, {
      record: record.data,
      isUpdate: true,
    });
  }
  async function handleDelete(record: Recordable) {
    await deleteDepartment(record.id);
    reload();
  }
  function handleSuccess() {
    reload();
  }
</script>
<template>
  <div>
    <basic-table @register="registerTable">
      <template #toolbar>
        <a-button v-auth="'system:department:create'" type="primary" @click="handleCreate">
          新增部门
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <table-action
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑',
                auth: 'system:department:update',
                ifShow: record.data.isSystemic === YesNo.NO,
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                tooltip: '删除',
                color: 'error',
                auth: 'system:department:delete',
                ifShow: record.data.isSystemic === YesNo.NO,
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
    <department-modal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
