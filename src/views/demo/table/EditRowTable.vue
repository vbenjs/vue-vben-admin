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
    EditRecordRow,
  } from '/@/components/Table';
  import { optionsListApi } from '/@/api/demo/select';

  import { demoListApi } from '/@/api/demo/table';
  const columns: BasicColumn[] = [
    {
      title: '输入框',
      dataIndex: 'name',
      editRow: true,
      editComponentProps: {
        prefix: '$',
      },
      width: 200,
    },
    {
      title: '默认输入状态',
      dataIndex: 'name7',
      editRow: true,
      width: 200,
    },
    {
      title: '输入框校验',
      dataIndex: 'name1',
      editRow: true,
      // 默认必填校验
      editRule: true,
      width: 200,
    },
    {
      title: '输入框函数校验',
      dataIndex: 'name2',
      editRow: true,
      editRule: async (text) => {
        if (text === '2') {
          return '不能输入该值';
        }
        return '';
      },
      width: 200,
    },
    {
      title: '数字输入框',
      dataIndex: 'id',
      editRow: true,
      editRule: true,
      editComponent: 'InputNumber',
      width: 200,
    },
    {
      title: '下拉框',
      dataIndex: 'name3',
      editRow: true,
      editComponent: 'Select',
      editComponentProps: {
        options: [
          {
            label: 'Option1',
            value: '1',
          },
          {
            label: 'Option2',
            value: '2',
          },
        ],
      },
      width: 200,
    },
    {
      title: '远程下拉',
      dataIndex: 'name4',
      editRow: true,
      editComponent: 'ApiSelect',
      editComponentProps: {
        api: optionsListApi,
      },
      width: 200,
    },
    {
      title: '勾选框',
      dataIndex: 'name5',
      editRow: true,

      editComponent: 'Checkbox',
      editValueMap: (value) => {
        return value ? '是' : '否';
      },
      width: 200,
    },
    {
      title: '开关',
      dataIndex: 'name6',
      editRow: true,
      editComponent: 'Switch',
      editValueMap: (value) => {
        return value ? '开' : '关';
      },
      width: 200,
    },
  ];
  export default defineComponent({
    components: { BasicTable, TableAction },
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
        record.onEdit?.(true);
      }

      function handleCancel(record: EditRecordRow) {
        currentEditKeyRef.value = '';
        record.onEdit?.(false, false);
      }

      async function handleSave(record: EditRecordRow) {
        const pass = await record.onEdit?.(false, true);
        if (pass) {
          currentEditKeyRef.value = '';
        }
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
