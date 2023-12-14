<template>
  <BasicTable @register="registerTable">
    <template #form-custom> custom-slot </template>
    <template #headerTop>
      <Alert type="info" show-icon>
        <template #message>
          <template v-if="state.selectedRowKeys.length > 0">
            <span>已选中{{ state.selectedRowKeys.length }}条记录(可跨页)</span>
            <a-button type="link" @click="state.selectedRowKeys.splice(0)" size="small"
              >清空</a-button
            >
          </template>
          <template v-else>
            <span>未选中任何项目</span>
          </template>
        </template>
      </Alert>
    </template>
    <template #toolbar>
      <a-button type="primary" @click="getFormValues">获取表单数据</a-button>
    </template>
  </BasicTable>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { getBasicColumns, getFormConfig } from './tableData';
  import { Alert } from 'ant-design-vue';
  import type { Key } from 'ant-design-vue/lib/table/interface';

  import { demoListApi } from '@/api/demo/table';

  const state = reactive<{
    selectedRowKeys: Key[];
  }>({
    selectedRowKeys: [],
  });

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
      selectedRowKeys: state.selectedRowKeys,
      onSelect: onSelect,
      onSelectAll: onSelectAll,
    },
  });

  function getFormValues() {
    console.log(getForm().getFieldsValue());
  }

  function onSelect(record, selected) {
    if (selected) {
      state.selectedRowKeys.push(record.id);
      return;
    }
    const delIdx = state.selectedRowKeys.indexOf(record.id);

    if (delIdx !== -1) {
      state.selectedRowKeys.splice(delIdx, 1);
    }
  }

  function onSelectAll(selected, selectedRows, changeRows) {
    const changeIds = changeRows.map((item) => item.id);
    if (selected) {
      state.selectedRowKeys.push(...changeIds);
    } else {
      state.selectedRowKeys.splice(0);
    }
  }
</script>
