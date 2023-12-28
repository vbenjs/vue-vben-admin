<template>
  <BasicTable @register="registerTable">
    <template #form-custom> custom-slot </template>
    <template #toolbar>
      <a-button type="primary" @click="getFormValues">获取表单数据</a-button>
    </template>
  </BasicTable>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getBasicColumns, getFormConfig } from './tableData';

  import { demoListApi } from '@/api/demo/table';

  const [registerTable, { getForm }] = useTable({
    title: '开启搜索区域',
    api: demoListApi,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'id',
    rowSelection: {
      type: 'checkbox',
    },
    showSelectionBar: true, // 显示多选状态栏
  });

  function getFormValues() {
    console.log(getForm().getFieldsValue());
  }
</script>
