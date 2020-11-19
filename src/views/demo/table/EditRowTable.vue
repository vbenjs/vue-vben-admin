<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #action="{ record, column }">
        <TableAction :actions="createActions(record, column)" />
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import {
    BasicTable,
    useTable,
    TableAction,
    BasicColumn,
    ActionItem,
    renderEditableRow,
    EditTableHeaderIcon,
    EditRecordRow,
  } from '/@/components/Table';

  import { demoListApi } from '/@/api/demo/table';
  const columns: BasicColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      customRender: renderEditableRow({ dataIndex: 'id' }),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      customRender: renderEditableRow({
        dataIndex: 'name',
      }),
    },
  ];
  export default defineComponent({
    components: { BasicTable, EditTableHeaderIcon, TableAction },
    setup() {
      const currentEditKeyRef = ref('');

      const [registerTable] = useTable({
        title: '可编辑行示例',
        api: demoListApi,
        columns: columns,
        showIndexColumn: false,
        actionColumn: {
          width: 160,
          title: 'Action',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      function handleEdit(record: EditRecordRow) {
        currentEditKeyRef.value = record.key;
        record.editable = true;
      }

      function handleCancel(record: EditRecordRow) {
        currentEditKeyRef.value = '';
        record.editable = false;
        record.onCancel && record.onCancel();
      }

      function handleSave(record: EditRecordRow) {
        currentEditKeyRef.value = '';
        record.editable = false;
        record.onSubmit && record.onSubmit();
      }

      function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
        if (!record.editable) {
          return [
            {
              label: '编辑',
              disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
              onClick: handleEdit.bind(null, record),
            },
          ];
        }
        return [
          {
            label: '保存',
            onClick: handleSave.bind(null, record, column),
          },
          {
            label: '取消',
            popConfirm: {
              title: '是否取消编辑',
              confirm: handleCancel.bind(null, record, column),
            },
          },
        ];
      }

      return {
        registerTable,
        handleEdit,
        createActions,
      };
    },
  });
</script>
