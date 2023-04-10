<script lang="ts" setup>
  import { useGo } from '/@/hooks/web/usePage';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';

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
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
    },
  });

  const go = useGo();

  function handleDetail(record: Recordable) {
    console.log('查看日志详情', record.id);
    go('/system/log/' + record.id);
  }
</script>
<template>
  <div>
    <basic-table @register="register">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <table-action
            :actions="[
              {
                icon: 'ant-design:info-circle-outlined',
                tooltip: '详情',
                onClick: handleDetail.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </basic-table>
  </div>
</template>
