<script lang="ts" setup>
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';

  import { YesNo } from '/@/enums/YesNo';

  import TemplateGroupModal from './TemplateGroupModal.vue';
  import TemplateDrawer from './TemplateDrawer.vue';
  import { columns, searchFormSchema } from './template-group.data';
  import { listTemplateGroups, deleteTemplateGroup } from '/@/apis/template-groups';
  const [register, { reload }] = useTable({
    title: '模板组列表',
    columns: columns,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
    },
    api: listTemplateGroups,
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
    await deleteTemplateGroup(record.id);
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
        <a-button type="primary" @click="handleCreate"> 新增模板组 </a-button>
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
                icon: 'ant-design:setting-outlined',
                tooltip: '模板配置',
                ifShow: record.isSystemic === YesNo.NO,
                onClick: handleSetting.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                tooltip: '删除',
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
    <template-group-modal @register="registerModal" @success="handleSuccess" />
    <template-drawer @register="registerDrawer" />
  </div>
</template>
