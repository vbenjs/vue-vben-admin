<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'name'">
          <span>
            姓名
            <BasicHelp class="ml-2" text="headerHelpMessage方式2" />
          </span>
        </template>
        <template v-else-if="column.key === 'address'">
          地址
          <FormOutlined class="ml-2" />
        </template>
        <template v-else>
          <HeaderCell :column="column" />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getCustomHeaderColumns } from './tableData';
  import { FormOutlined } from '@ant-design/icons-vue';
  import { demoListApi } from '@/api/demo/table';
  import { BasicHelp } from '@/components/Basic';
  import HeaderCell from '@/components/Table/src/components/HeaderCell.vue';

  const [registerTable] = useTable({
    title: '定高/头部自定义',
    api: demoListApi,
    columns: getCustomHeaderColumns(),
    canResize: false,
    scroll: { y: 100 },
  });
</script>
