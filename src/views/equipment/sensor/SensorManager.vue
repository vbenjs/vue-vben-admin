<template>
  <div>
    <BasicTable @register="registerTable" @edit-end="handleEditEnd" />

    <ShowJson @register="registerJsonDrawer" title="最近数据" />
    <OriginData @register="registerOriginDataDrawer" />
  </div>
</template>
<script lang="tsx" setup>
  import { getFormConfig, getColumns } from './data';
  import { SensorResult } from '@/api/model/sensorModel';
  import { deleteSensor, getSensor, updateSensorMark } from '@/api/sensor';
  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { useGo } from '@/hooks/web/usePage';
  import { HashingFactory } from '@/utils/cipher';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useFormat } from '@/utils/format';

  defineOptions({ name: 'SensorManager' });

  const ShowJson = createAsyncComponent(() => import('@/views/Drawers/ShowJson.vue'));
  const OriginData = createAsyncComponent(() => import('@/views/Drawers/OriginData.vue'));

  const go = useGo();
  const { formatSensor, formatStore } = useFormat();
  const encryptByMd5 = HashingFactory.createMD5Hashing().hash;

  const [registerJsonDrawer, { openDrawer: openJsonDrawer }] = useDrawer();
  const [registerOriginDataDrawer, { openDrawer: openOriginDataDrawer }] = useDrawer();
  const [registerTable, { reload }] = useTable({
    api: (where) => getSensor(where, true),
    title: '传感器列表',
    columns: getColumns(),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    loading: true,
    showIndexColumn: false,
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
      auth: ['SensorManager_note', 'SensorManager_origin', 'SensorManager_last'],
      customRender: ({ record }) => {
        return createActions(record as SensorResult);
      },
    },
  });

  const createActions = (record: SensorResult) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'ant-design:file-search-outlined',
            tooltip: '原始记录',
            auth: 'SensorManager_origin',
            onClick: () =>
              openOriginDataDrawer(true, {
                id: record.id,
                sensorType: record.sensorType,
              }),
          },
          {
            icon: 'fa-regular:file-code',
            tooltip: '最近数据',
            auth: 'SensorManager_last',
            onClick: () => openJsonDrawer(true, record.lastData),
          },
          {
            icon: 'icon-park-outline:alarm',
            tooltip: '告警设置',
            auth: 'SensorAlarm',
            onClick: () => {
              const id = encryptByMd5(record.id + 'SENSOR');
              go({
                path: '/alarm/equipment/' + id,
                query: {
                  equipmentId: record.id,
                  equipmentType: 'SENSOR',
                  equipmentName: formatSensor(record, '#'),
                  store: formatStore(record.store),
                  permissionCode: 'SensorAlarm',
                  equipment: JSON.stringify(record),
                },
              });
            },
          },
          {
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: 'SensorManager_del',
            popConfirm: {
              title: '是否确认删除？',
              placement: 'left',
              confirm: async () => {
                await deleteSensor(record.id);
                reload();
              },
            },
          },
        ]}
      />
    );
  };

  const handleEditEnd = async ({ record, key, value }) => {
    if (key !== 'remark') return;
    try {
      await updateSensorMark({
        id: record.id,
        remark: value,
      });
    } catch (err) {
      console.log(err);
    }
  };
</script>
