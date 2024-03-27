<template>
  <div class="h-full flex p-4">
    <div class="flex flex-col pr-4 w-1/2">
      <div class="flex-1 h-0">
        {{ row?.id }}
        <BasicTable title="点击收集(使用 useTable)" @register="registerTable" />
      </div>
      <div class="h-4 shrink-0"></div>
      <div class="flex-1 h-0">
        {{ row2?.id }}
        <BasicTable title="移入收集(使用 useTable)" @register="registerTable2" />
      </div>
    </div>
    <div class="flex flex-col pr-4 w-1/2">
      <div class="flex-1 h-0">
        {{ row3?.id }}
        <BasicTable ref="tableActionRef1" title="点击收集(使用 refTable)" isCanResizeParent :api="demoListApi"
          :columns="getBasicColumns()" />
      </div>
      <div class="flex-1 h-0">
        {{ row4?.id }}
        <BasicTable ref="tableActionRef2" title="移入收集(使用 refTable)" isCanResizeParent :api="demoListApi"
          :columns="getBasicColumns()" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { BasicTable, TableActionType, useTable, useTrackTableRow } from '@/components/Table';
import { getBasicColumns, getFormConfig } from './tableData';

import { demoListApi } from '@/api/demo/table';
import { ref } from 'vue';

const [registerTable, tableAction] = useTable({
  api: demoListApi,
  columns: getBasicColumns(),
  useSearchForm: false,
  formConfig: getFormConfig(),
  showTableSetting: false,
  tableSetting: { fullScreen: true },
  showIndexColumn: false,
  isCanResizeParent: true,
});


const [registerTable2, tableAction2] = useTable({
  api: demoListApi,
  columns: getBasicColumns(),
  formConfig: getFormConfig(),
  showTableSetting: false,
  tableSetting: { fullScreen: true },
  showIndexColumn: false,
  isCanResizeParent: true,
  useSearchForm: false,
  pagination: false,
});

const tableActionRef1 = ref<TableActionType>()
const tableActionRef2 = ref<TableActionType>()

const { row } = useTrackTableRow(tableAction) // useTable
const { row: row3 } = useTrackTableRow(tableActionRef1) // refTable
const { row: row2 } = useTrackTableRow(tableAction2, { trigger: 'hover' }) // useTable + hover
const { row: row4 } = useTrackTableRow(tableActionRef2, { trigger: 'hover' }) // refTable + hover

</script>
