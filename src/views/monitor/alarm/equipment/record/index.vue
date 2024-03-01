<template>
  <div>
    <BasicTable @register="registerTable" :showSorterTooltip="false" />
    <RemindRecordDrawer @register="registerDrawer" />
  </div>
</template>
<script lang="tsx" setup>
  import { useRoute } from 'vue-router';
  import { getColumns, getFormConfig } from '../../record/data';
  import { RemindRecordResult } from '@/api/remind/model/recordModel';
  import { getRemindRecord, getRemindRecordById } from '@/api/remind/record';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { createEquipmentStatistics } from '@/views/common/Modals/statistics';
  import { useDrawer } from '@/components/Drawer';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  const RemindRecordDrawer = createAsyncComponent(
    () => import('@/views/common/Drawers/RemindRecordDrawer.vue'),
  );

  const route = useRoute();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable] = useTable({
    api: getRemindRecord,
    beforeFetch: (params) => {
      params.equipmentId = route.query.equipmentId;
      params.equipmentType = route.query.equipmentType;
      return params;
    },
    columns: getColumns({ isEquipment: true }),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig({ isEquipment: true }),
    showTableSetting: true,
    loading: true,
    showIndexColumn: false,
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
      customRender: ({ record }) => {
        return createActions(record as RemindRecordResult);
      },
    },
    defSort: {
      columnKey: 'remindTime',
      order: 'descend',
    },
  });

  const createActions = (record: RemindRecordResult) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'mdi:chart-line',
            tooltip: '数据统计',
            auth: [route.query.permissionCode + '_chart'],
            onClick: () => {
              createEquipmentStatistics({
                title: `数据统计（${record.equipmentName}）`,
                equipmentIds: [record.equipmentId],
              });
            },
            ifShow: record.equipmentType === 'CUSTOM',
          },
          {
            icon: 'ant-design:eye-outlined',
            tooltip: '查看',
            auth: route.query.permissionCode + '_show',
            onClick: () => {
              openDrawer(true, {
                id: record.id,
                api: getRemindRecordById,
              });
            },
          },
        ]}
      />
    );
  };
</script>
