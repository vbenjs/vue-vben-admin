<template>
  <BasicTable @register="registerTable" @fetch-success="checkedRecordsUpdate">
    <template #form-custom> custom-slot </template>
    <template #headerTop>
      <Alert type="info" show-icon>
        <template #message>
          <template v-if="checkedRecords.length > 0">
            <span>已选中{{ checkedRecords.length }}条记录(可跨页)</span>
            <a-button type="link" @click="tableSelectBarClear" size="small">清空</a-button>
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
  import { ref } from 'vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { getBasicColumns, getFormConfig } from './tableData';
  import { Alert } from 'ant-design-vue';
  import type { Key } from 'ant-design-vue/lib/table/interface';
  import type { TableRowSelection } from '@/components/Table/src/types/table';

  import { demoListApi } from '@/api/demo/table';

  const checkedRecords = ref<Key[]>([]);
  const checkedPageRecords = ref<Key[]>([]);

  const rowSelectionOnChange: TableRowSelection['onChange'] = (selectedRowKeys) => {
    // 本页新出现的
    const adds = selectedRowKeys.filter((key) => !checkedPageRecords.value.includes(key));
    // 本页已消失的
    const removes = checkedPageRecords.value.filter((key) => !selectedRowKeys.includes(key));

    // 添加/更新到全部
    for (const k of adds) {
      const index = checkedRecords.value.findIndex((key) => key === k);
      if (index > -1) {
        checkedRecords.value.splice(index, 1, k);
      } else {
        checkedRecords.value.push(k);
      }
    }

    // 从全部删除
    for (const k of removes) {
      const index = checkedRecords.value.findIndex((key) => key === k);
      if (index > -1) {
        checkedRecords.value.splice(index, 1);
      }
    }

    // 刷新本页记录
    checkedPageRecords.value = [...selectedRowKeys];
  };

  // 清空选择
  const tableSelectBarClear = () => {
    checkedRecords.value = [];
    setSelectedRowKeys([]);
  };

  // 移除记录（如果存在删除记录的操作）
  // const checkedRecordsRemove = (ids: (string | number)[]) => {
  //   for (const id of ids) {
  //     const index = checkedRecords.value.findIndex((o) => o.id === id);
  //     if (index > -1) {
  //       checkedRecords.value.splice(index, 1);
  //     }
  //   }
  // };

  const checkedRecordsUpdate = () => {
    // 当前页数据
    const dataSourceKeys = getDataSource().map((o) => o.id) as Array<Key>;
    for (const record of getDataSource()) {
      const index = checkedRecords.value.findIndex((key) => key === record.id);
      if (index > -1) {
        // 如果全部里存在，就更新它
        checkedRecords.value.splice(index, 1, record.id as Key);
      }
    }
    // 当前页存在全部里的
    const pageRecords = checkedRecords.value.filter((key) => dataSourceKeys.includes(key));
    // 刷新
    checkedPageRecords.value = pageRecords;
  };

  const [registerTable, { getForm, setSelectedRowKeys, getDataSource }] = useTable({
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
      onChange: rowSelectionOnChange,
    },
  });

  function getFormValues() {
    console.log(getForm().getFieldsValue());
  }
</script>
