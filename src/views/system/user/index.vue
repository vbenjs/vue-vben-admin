<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" />

    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">新增账号</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'ant-design:info-circle-outlined',
                tooltip: '查看用户详情',
                onClick: handleView.bind(null, record),
              },
              {
                icon: 'ant-design:edit-outlined',
                tooltip: '编辑用户资料',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除此账号',
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
    <UserModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup name="用户管理">
  import { reactive } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import { useModal } from '/@/components/Modal';
  import DeptTree from './DeptTree.vue';
  import UserModal from './UserModal.vue';
  import { getUserList, deleteUser } from '/@/api/system/user';
  import { columns, searchFormSchema } from './user.data';

  const go = useGo();
  const searchInfo = reactive<Recordable>({});
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, updateTableDataRecord, deleteTableDataRecord }] = useTable({
    title: '账号列表',
    api: getUserList,
    rowKey: 'id',
    columns,
    formConfig: {
      labelWidth: 60,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
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

  function handleDelete(record: Recordable) {
    deleteUser(record.id);
    deleteTableDataRecord(record.id);
  }

  function handleSuccess() {
    reload();
  }

  function handleSelect(deptId) {
    searchInfo.deptId = deptId;
    reload();
  }

  function handleView(record: Recordable) {
    go('/system/user_detail/' + record.id);
  }
</script>
