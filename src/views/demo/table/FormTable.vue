<template>
  <BasicTable @register="registerTable">
    <template #form-custom> custom-slot </template>

    <template #toolbar>
      <a-button type="primary" @click="getFormValues">获取表单数据</a-button>
    </template>
  </BasicTable>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getBasicColumns, getFormConfig } from './tableData';

  import { demoListApi } from '/@/api/demo/table';

  export default defineComponent({
    components: { BasicTable },
    setup() {
      const [registerTable, { getForm }] = useTable({
        title: '开启搜索区域',
        api: demoListApi,
        columns: getBasicColumns(),
        useSearchForm: true,
        formConfig: getFormConfig(),
        showTableSetting: true,
        rowSelection: { type: 'checkbox' },
      });

      function getFormValues() {
        console.log(getForm().getFieldsValue());
      }

      return {
        registerTable,
        getFormValues,
      };
    },
  });
</script>
