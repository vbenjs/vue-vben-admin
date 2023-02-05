<template>
  <div class="p-4">
    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getMergeHeaderColumns } from './tableData';

  import { demoListApi } from '/@/api/demo/table';

  export default defineComponent({
    components: { BasicTable },
    setup() {
      const [registerTable] = useTable({
        title: '合并单元格',
        bordered: true,
        api: demoListApi,
        columns: getMergeHeaderColumns(),
      });

      return {
        registerTable,
      };
    },
  });
</script>
