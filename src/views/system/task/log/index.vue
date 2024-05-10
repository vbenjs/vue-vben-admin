<template>
  <BasicTable @register="registerTable" />
</template>
<script lang="ts" setup name="任务日志">
  import { BasicTable, useTable } from '/@/components/Table';
  import { getTaskLogList } from '/@/api/system/log';
  import { columns, searchFormSchema } from './log.data';

  const [registerTable, {}] = useTable({
    title: '任务日志',
    api: getTaskLogList,
    useSearchForm: true,
    formConfig: {
      labelWidth: 80,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    columns: columns,
    bordered: true,
    striped: false,
    showTableSetting: true,
    showIndexColumn: false,
    rowKey: 'id',
  });
</script>
