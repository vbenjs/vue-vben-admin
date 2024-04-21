<template>
  <div class="p-4">
    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getMultipleHeaderColumns } from './tableData';

  import { demoListApi } from '@/api/demo/table';

  const [registerTable] = useTable({
    title: '多级表头示例',
    api: demoListApi,
    columns: getMultipleHeaderColumns(),
  });
</script>
