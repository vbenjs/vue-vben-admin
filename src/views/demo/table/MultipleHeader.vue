<template>
  <div class="p-4">
    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { demoListApi } from '@/api/demo/table';
  import { BasicTable, useTable } from '@/components/Table';

  import { getMultipleHeaderColumns } from './tableData';

  export default defineComponent({
    components: { BasicTable },
    setup() {
      const [registerTable] = useTable({
        title: '多级表头示例',
        api: demoListApi,
        columns: getMultipleHeaderColumns(),
      });

      return {
        registerTable,
      };
    },
  });
</script>
