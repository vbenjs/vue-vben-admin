<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="属性" :width="1100" destroyOnClose>
    <BasicTable @register="registerTable" @edit-end="handleEditEnd" />
  </BasicDrawer>
</template>
<script lang="tsx" setup>
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicTable, useTable } from '@/components/Table';
  import { ref } from 'vue';
  import { formatLastTime, formatLastTimeColor } from '@/utils/dateUtil';
  import { Tag } from 'ant-design-vue';
  import { getEquipmentAttributes, updateAttributeMark } from '@/api/equipment';
  import { useEnumStore } from '@/store/modules/enum';
  import { LastValue } from '@/views/common/components';

  const equipmentId = ref<number>(0);

  defineEmits(['load', 'register', 'success']);
  const enumStore = useEnumStore();

  const [registerTable, { updateTableDataRecord }] = useTable({
    api: () => getEquipmentAttributes(equipmentId.value, true),
    columns: [
      {
        dataIndex: 'remark',
        title: '备注',
        width: 160,
        edit: true,
      },
      {
        dataIndex: 'attributeType',
        title: '属性类型',
        width: 160,
        customRender: ({ text }) => enumStore.attributeTypeMap.get(text),
      },
      {
        dataIndex: ['sensor', 'sensorType'],
        title: '传感器类型',
        width: 160,
        customRender: ({ text }) => enumStore.sensorTypeMap.get(text),
      },
      {
        dataIndex: ['sensor', 'sensorNum'],
        title: '传感器编号',
        width: 120,
        customRender: ({ record }) => {
          const d = record.sensor;
          const sensorNum = d?.sensorNum;
          if (!sensorNum) return '';
          if (record.sensorType == 'MULTI_NODE')
            return sensorNum + '（' + parseInt(sensorNum, 16) + '）';
          return sensorNum;
        },
      },
      {
        dataIndex: ['sensor', 'lastDataTime'],
        title: '最近通信时间',
        width: 120,
        customRender: ({ text }) => (
          <Tag color={formatLastTimeColor(text)}>{formatLastTime(text)}</Tag>
        ),
      },
      {
        dataIndex: ['sensor', 'lastData'],
        title: '最近值',
        width: 220,
        customRender: ({ text }) => <LastValue data={text} />,
      },
    ],
    rowKey: 'id',
    size: 'small',
    loading: true,
    showIndexColumn: false,
    showTableSetting: true,
    tableSetting: {
      redo: true,
      setting: false,
      size: false,
    },
    pagination: { hideOnSinglePage: true },
  });

  const [registerDrawer] = useDrawerInner(async (data) => {
    equipmentId.value = data.equipmentId;
  });

  const handleEditEnd = async ({ record, key, value }) => {
    console.log(record, key, value);
    if (key !== 'remark') return;
    try {
      await updateAttributeMark({
        id: record.id,
        remark: value,
      });
      updateTableDataRecord(record.id, {
        ...record,
        remark: value,
      });
    } catch (err) {
      console.log(err);
    }
  };
</script>
