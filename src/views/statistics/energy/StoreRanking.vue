<template>
  <BasicTable @register="registerTable" />
</template>
<script lang="ts" setup name="StoreRank">
  import { getStoreRanking } from '@/api/report';
  import { BasicTable, useTable } from '@/components/Table';
  import { useFormat } from '@/utils/format';

  const { formatStore } = useFormat();
  const [registerTable] = useTable({
    api: getStoreRanking,
    columns: [
      {
        dataIndex: 'name',
        title: '地点',
        width: 200,
        customRender: ({ record }) => formatStore(record as any),
      },
      { dataIndex: 'monitorElectrical', title: '监测能耗', width: 120 },
      { dataIndex: 'electrical', title: '抄表能耗', width: 120 },
      { dataIndex: 'turnover', title: '营业额', width: 120 },
      { dataIndex: 'ratio', title: '能效比(kW·h/元)', width: 160 },
      { dataIndex: 'ranking', title: '能效比排名', width: 160 },
    ],
    rowKey: 'id',
    showTableSetting: true,
    showIndexColumn: false,
    useSearchForm: true,
    formConfig: {
      autoSubmitOnEnter: true,
      rowProps: { gutter: 12 },
      // labelWidth: 80,
      // showAdvancedButton: false,
      schemas: [
        {
          label: '年月',
          field: `powerTime`,
          component: 'DatePicker',
          componentProps: {
            picker: 'month',
            valueFormat: 'YYYY-MM',
          },
          defaultValue: new Date(),
          colProps: { span: 6 },
        },
      ],
    },
    // isCanResizeParent: true,
    // pagination: { hideOnSinglePage: true },
    loading: true,
  });
</script>
