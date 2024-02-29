<template>
  <div>
    <BasicTable @register="registerTable" :showSorterTooltip="false" />
    <RemindRecordDrawer @register="registerDrawer" />
    <NotificationRecord @register="registerNotificationDrawer" />
  </div>
</template>
<script lang="tsx" setup>
  import { createEquipmentStatistics } from '@/views/Modals/statistics';
  import { getFormConfig, getColumns, getItemApi } from './data';
  import { RemindRecordResult } from '@/api/remind/model/recordModel';
  import { getRemindRecord } from '@/api/remind/record';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useDrawer } from '@/components/Drawer';

  defineOptions({ name: 'AlarmRecord' });

  const RemindRecordDrawer = createAsyncComponent(
    () => import('@/views/Drawers/RemindRecordDrawer.vue'),
  );
  const NotificationRecord = createAsyncComponent(() => import('./Drawer/NotificationRecord.vue'));

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerNotificationDrawer, { openDrawer: openNotificationDrawer }] = useDrawer();
  const [registerTable] = useTable({
    api: getRemindRecord,
    columns: getColumns(),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    loading: true,
    showIndexColumn: false,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      auth: ['AlarmRecord_chart', 'AlarmRecord_show'],
      customRender: ({ record }) => {
        return createActions(record as RemindRecordResult);
      },
      align: 'left',
      customHeaderCell: (column) => {
        column.align = 'center';
        return column;
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
            icon: 'ant-design:eye-outlined',
            tooltip: '查看',
            auth: 'AlarmRecord_show',
            onClick: () => {
              openDrawer(true, {
                id: record.id,
                api: getItemApi,
              });
            },
          },
          {
            icon: 'ant-design:file-search-outlined',
            tooltip: '发送记录',
            auth: 'AlarmRecord_notification',
            onClick: () => {
              openNotificationDrawer(true, {
                recordId: record.id,
                title: '通知记录',
              });
            },
          },
          {
            icon: 'mdi:chart-line',
            tooltip: '数据统计',
            auth: ['AlarmRecord_chart'],
            onClick: () => {
              createEquipmentStatistics({
                title: `数据统计（${record.equipmentName}）`,
                equipmentIds: [record.equipmentId],
              });
            },
            ifShow: record.equipmentType === 'CUSTOM',
          },
        ]}
      />
    );
  };
</script>
