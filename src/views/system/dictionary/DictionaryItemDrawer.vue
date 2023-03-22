<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';

  import { YesNo } from '/@/enums/YesNo';

  import DictionaryItemModal from './DictionaryItemModal.vue';
  import { columns, searchFormSchema } from './dictionary-item.data';
  import { listDictionaryItems, deleteDictionaryItem } from '/@/apis/dictionary-items';
  const dictionaryId = ref<Nullable<string>>(null);
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    dictionaryId.value = data.id;
    reload();
  });
  const emit = defineEmits(['success', 'register']);
  async function handleSubmit() {
    try {
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload }] = useTable({
    title: '字典项列表',
    columns: columns,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
    },
    api: (args) => {
      return listDictionaryItems({ ...args, dictionaryId: unref(dictionaryId) });
    },
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
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
      dictionaryId: unref(dictionaryId),
    });
  }
  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      dictionaryId: unref(dictionaryId),
    });
  }
  async function handleDelete(record: Recordable) {
    await deleteDictionaryItem(record.id);
    reload();
  }
  function handleSuccess() {
    reload();
  }
</script>
<template>
  <div>
    <basic-drawer
      v-bind="$attrs"
      @register="registerDrawer"
      showFooter
      title="字典配置"
      width="800px"
      @ok="handleSubmit"
    >
      <basic-table @register="registerTable">
        <template #toolbar>
          <a-button type="primary" @click="handleCreate"> 新增字典项 </a-button>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <table-action
              :actions="[
                {
                  icon: 'clarity:note-edit-line',
                  ifShow: record.isSystemic === YesNo.NO,
                  onClick: handleEdit.bind(null, record),
                },
                {
                  icon: 'ant-design:delete-outlined',
                  color: 'error',
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
    </basic-drawer>
    <dictionary-item-modal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
