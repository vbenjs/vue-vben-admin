<template>
  <div class="p-4">
    <BasicTable
      :rowSelection="{ type: 'checkbox' }"
      title="树形表格"
      titleHelpMessage="树形组件不能和序列号列同时存在"
      :columns="columns"
      :dataSource="data"
      rowKey="id"
      :indentSize="20"
      isTreeTable
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { getBasicColumns, getTreeTableData } from './tableData';

  export default defineComponent({
    components: { BasicTable },
    setup() {
      return {
        columns: getBasicColumns(),
        data: getTreeTableData(),
      };
    },
  });
</script>
