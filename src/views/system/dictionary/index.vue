<script lang="ts" setup>
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import DictionaryModal from './DictionaryModal.vue';
  import DictionaryItemDrawer from './DictionaryItemDrawer.vue';
  import { columns, searchFormSchema } from './dictionary.data';
  import { listDictionaries, deleteDictionary } from '/@/apis/dictionaries';
  const [register, { reload }] = useTable({
    title: '字典列表',
    columns: columns,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
    },
    api: listDictionaries,
    showIndexColumn: false,
    bordered: true,
    showTableSetting: true,
    canResize: false,
    useSearchForm: true,
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
    },
  });
  const [registerModal, { openModal }] = useModal();
  const [registerDrawer, { openDrawer }] = useDrawer();
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
  function handleSetting(record: Recordable) {
    openDrawer(true, record);
  }
  async function handleDelete(record: Recordable) {
    await deleteDictionary(record.id);
    reload();
  }
  function handleSuccess() {
    reload();
  }
</script>
<template>
  <div>
    <basic-table @register="register">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增字典 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <table-action
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:setting-outlined',
                tooltip: '字典配置',
                onClick: handleSetting.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                tooltip: '删除',
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
    </basic-table>
    <dictionary-modal @register="registerModal" @success="handleSuccess" />
    <dictionary-item-drawer @register="registerDrawer" />
  </div>
</template>
