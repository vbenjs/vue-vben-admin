<template>
  <div class="h-full flex p-4">
    <div class="flex flex-col pr-4 w-1/2">
      <div class="flex-1">
        <BasicTable @register="registerTable" />
      </div>
      <div class="h-4"></div>
      <div class="flex-1">
        <BasicTable @register="registerTable" />
      </div>
    </div>
    <div class="flex-1 flex flex-col w-1/2 h-full">
      <div class="h-1/3 mb-4">
        <BasicTable @register="registerTable" />
      </div>
      <div class="h-1/3 mb-4">
        <BasicTable @register="registerTable2" />
      </div>
      <div class="h-1/3">
        <BasicTable @register="registerTable1" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getBasicColumns, getFormConfig } from './tableData';

  import { demoListApi } from '/@/api/demo/table';

  export default defineComponent({
    components: { BasicTable },
    setup(_) {
      const [registerTable] = useTable({
        api: demoListApi,
        columns: getBasicColumns(),
        useSearchForm: false,
        formConfig: getFormConfig(),
        showTableSetting: false,
        tableSetting: { fullScreen: true },
        showIndexColumn: false,
        isCanResizeParent: true,
        rowKey: 'id',
      });

      const [registerTable1] = useTable({
        api: demoListApi,
        columns: getBasicColumns(),
        formConfig: getFormConfig(),
        showTableSetting: false,
        tableSetting: { fullScreen: true },
        showIndexColumn: false,
        isCanResizeParent: true,
        useSearchForm: false,
        rowKey: 'id',
      });

      const [registerTable2] = useTable({
        api: demoListApi,
        columns: getBasicColumns(),
        formConfig: getFormConfig(),
        showTableSetting: false,
        tableSetting: { fullScreen: true },
        showIndexColumn: false,
        isCanResizeParent: true,
        useSearchForm: false,
        pagination: false,
        rowKey: 'id',
      });

      return {
        registerTable,
        registerTable1,
        registerTable2,
      };
    },
  });
</script>
