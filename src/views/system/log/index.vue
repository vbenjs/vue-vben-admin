<script lang="ts" setup>
  import { BasicTable, useTable } from '/@/components/Table';

  import { listLogs } from '/@/apis/logs';

  import { columns, searchFormSchema } from './log.data';

  const [register] = useTable({
    title: '日志列表',
    columns: columns,
    api: listLogs,
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
</script>
<template>
  <div>
    <basic-table @register="register" />
  </div>
</template>
