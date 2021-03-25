<template>
  <BasicTable @register="registerTable">
    <template #form-custom> custom-slot </template>
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
      const [registerTable] = useTable({
        title: '开启搜索区域',
        api: demoListApi,
        columns: getBasicColumns(),
        useSearchForm: true,
        formConfig: getFormConfig(),
        showTableSetting: true,
        rowSelection: { type: 'checkbox' },
      });

      return {
        registerTable,
      };
    },
  });
</script>
