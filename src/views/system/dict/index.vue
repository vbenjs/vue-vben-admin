<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'ant-design:edit-outlined',
                tooltip: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除此数据',
                popConfirm: {
                  title: '确认删除吗?',
                  okText: '确认',
                  cancelText: '取消',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" color="success" @click="handelAdd"> 添加 </a-button>
      </template>
    </BasicTable>

    <DictModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup name="参数配置">
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { getDictList, deleteDict } from '/@/api/system/dict';
  import { columns, searchFormSchema } from './dict.data';
  import DictModal from './DictModal.vue';

  const [registerTable, { reload }] = useTable({
    title: '字典配置',
    api: getDictList,
    formConfig: {
      labelWidth: 60,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,
    columns: columns,
    bordered: true,
    striped: false,
    showTableSetting: true,
    showIndexColumn: false,
    rowKey: 'id',
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
    },
  });
  const [registerModal, { openModal }] = useModal();

  function handelAdd() {
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

  async function handleDelete(record: Recordable) {
    await deleteDict(record.id);
  }

  function handleSuccess() {
    reload();
  }
</script>

<style scoped>
  ::v-deep(.ant-input-number) {
    min-width: 65px;
  }
</style>
