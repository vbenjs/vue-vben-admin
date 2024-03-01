<template>
  <div>
    <BasicTable @register="registerTable" @edit-end="handleEditEnd">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="bx:link"
          @click="handleCreate"
          v-auth="'EquipmentSensor_add'"
        >
          绑定传感器
        </a-button>
      </template>
    </BasicTable>

    <OriginData @register="registerOriginDataDrawer" />
    <SelectSensor @register="registerSelectDrawer" @success="handleSelect" />
  </div>
</template>
<script lang="tsx" setup>
  import { useRoute } from 'vue-router';
  import { getFormConfig, getColumns, permissionCode } from './data';
  import { getSensor, updateSensorMark } from '@/api/sensor';
  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useTabs } from '@/hooks/web/useTabs';
  import { SensorResult } from '@/api/model/sensorModel';
  import {
    equipmentUnbindSensor,
    equipmentBindSensor,
    equipmentChangeSensor,
  } from '@/api/equipment';
  import { YN } from '@/enums/YN';
  import { useMessage } from '@/hooks/web/useMessage';
  import { ref } from 'vue';

  defineOptions({ name: 'EquipmentSensor' });

  const OriginData = createAsyncComponent(() => import('@/views/common/Drawers/OriginData.vue'));
  const SelectSensor = createAsyncComponent(
    () => import('@/views/common/Drawers/SelectSensor.vue'),
  );

  const [registerOriginDataDrawer, { openDrawer: openOriginDataDrawer }] = useDrawer();
  const [registerSelectDrawer, { openDrawer: openSelectDrawer }] = useDrawer();
  const route = useRoute();
  const { setTitle } = useTabs();
  const { createConfirm, createMessage: msg } = useMessage();

  const changeId = ref(0);

  const equipmentName = route.query.equipmentName;
  setTitle(`传感器:(${equipmentName})`);

  const [registerTable, { reload }] = useTable({
    api: (where) => getSensor(where, true),
    searchInfo: {
      equipmentId: route.query.equipmentId,
    },
    columns: getColumns(),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    loading: true,
    showIndexColumn: false,
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
      auth: [`${permissionCode}_origin`, `${permissionCode}_change`, `${permissionCode}_del`],
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
            tooltip: '原始数据',
            auth: `${permissionCode}_origin`,
            onClick: () =>
              openOriginDataDrawer(true, {
                id: record.id,
                sensorType: record.sensorType,
              }),
          },
          {
            icon: 'tabler:status-change',
            tooltip: '更换传感器',
            color: 'warning',
            auth: `${permissionCode}_change`,
            onClick: handleChange.bind(null, record),
          },
          {
            icon: 'bx:unlink',
            color: 'warning',
            tooltip: '解绑传感器',
            auth: `${permissionCode}_del`,
            onClick: handleUnbind.bind(null, record.id),
          },
        ]}
      />
    );
  };

  const handleCreate = () => {
    openSelectDrawer(true, {
      title: '选择传感器',
      multiple: true,
      storeId: route.query.storeId,
    });
  };

  const handleChange = async (record: SensorResult) => {
    changeId.value = record.id;
    openSelectDrawer(true, {
      title: '更换传感器',
      storeId: route.query.storeId,
      key: 'change',
      sensorType: record.sensorType,
    });
  };

  const handleUnbind = async (id: number) => {
    const equipmentId = Number(route.query.equipmentId);
    let needReload = false;

    createConfirm({
      iconType: 'warning',
      title: '解绑传感器',
      content: '解除传感器绑定，是否删除相关数据？',
      okText: '保留数据',
      cancelText: '删除数据',
      closable: true,
      maskClosable: true,
      onOk: () => {
        needReload = true;
        return equipmentUnbindSensor(equipmentId, [id], YN.N);
      },
      onCancel: async (e) => {
        if (
          String(e)
            .replace(/[\r\n]/g, '')
            .replace(/[ ]/g, '') === '()=>{}'
        ) {
          return true;
        }
        needReload = true;
        const data = await equipmentUnbindSensor(equipmentId, [id], YN.Y);
        return data;
      },
      afterClose: () => {
        if (needReload) reload();
      },
    });
  };

  const handleSelect = async (array: SensorResult[], type: 'bind' | 'change') => {
    const ids = array.map((item) => item.id);
    const equipmentId = Number(route.query.equipmentId);
    if (type === 'bind') {
      await equipmentBindSensor(equipmentId, ids);
      msg.success('添加成功！');
    } else {
      await equipmentChangeSensor(equipmentId, changeId.value, ids[0]);
      changeId.value = 0;
      msg.success('更换成功！');
    }
    reload();
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
