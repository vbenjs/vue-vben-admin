<template>
  <div class="p-4">
    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getMergeHeaderColumns } from './tableData';

  import { demoListApi } from '@/api/demo/table';

  const [registerTable] = useTable({
    title: '合并单元格',
    bordered: true,
    api: demoListApi,
    columns: getMergeHeaderColumns(),
  });
</script>
