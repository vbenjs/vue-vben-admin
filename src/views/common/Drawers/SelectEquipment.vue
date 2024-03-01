<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    title="选择设备"
    :width="1200"
    destroyOnClose
    ok-text="选择"
    @ok="handleSubmit"
    showFooter
  >
    <BasicTable @register="registerTable" class="!p-0" showSelectionBar />
  </BasicDrawer>
</template>
<script lang="tsx" setup>
  import { getEquipment } from '@/api/equipment';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicTable, useTable } from '@/components/Table';
  import { ref } from 'vue';
  import { formatToDate } from '@/utils/dateUtil';
  import { useFormat } from '@/utils/format';
  import { message } from 'ant-design-vue';

  const storeId = ref<number>(0);
  const key = ref<'bind' | 'change'>('bind');

  const emit = defineEmits(['load', 'register', 'success']);
  const props = defineProps({
    api: {
      type: Function,
      default: getEquipment,
    },
    isSingle: {
      type: Boolean,
      default: false,
    },
  });

  const { formatStore, formatSensor } = useFormat();

  const [registerTable, { getSelectRows }] = useTable({
    api: (where) => props.api(where, true),
    beforeFetch: (where) => {
      where.storeId = storeId.value;
      // if (key.value == 'bind') {
      //   //只能选没有绑定的
      //   where.bindingEquipment = 'N';
      // }
      // if (key.value == 'change') {
      //   //都可以选，但是只能选相同类型的
      //   where.sensorType = sensorType.value;
      // }
      return where;
    },
    columns: [
      { dataIndex: 'equipmentName', title: '设备名称', width: 120 },
      {
        dataIndex: 'store',
        title: '所属地点',
        width: 220,
        customRender: ({ text }) => formatStore(text),
      },
      { dataIndex: 'workingAmpere', title: '工作电流(A)', width: 110 },
      { dataIndex: 'electricalEnergy', title: '总耗电量(kW·h)', width: 130 },
      {
        dataIndex: 'workingHours',
        title: '工作时长(小时)',
        width: 130,
        customRender: ({ text }) => (text ? (text / 3600).toFixed(2) : ''),
      },
      {
        dataIndex: 'sensor',
        title: '传感器',
        width: 400,
        customRender: ({ record }) => {
          return <div>{record.sensorList?.map((sensor) => formatSensor(sensor, 'tag'))}</div>;
        },
      },
      { dataIndex: 'remark', title: '备注', width: 160 },
      {
        dataIndex: 'createTime',
        title: '创建时间',
        width: 180,
        customRender: ({ text }) => formatToDate(text),
      },
    ],
    rowKey: 'id',
    size: 'small',
    loading: true,
    showIndexColumn: false,
    rowSelection: {
      type: props.isSingle ? 'radio' : 'checkbox',
    },
    // pagination: { hideOnSinglePage: true },
    resizeHeightOffset: 60,
    useSearchForm: true,
    formConfig: {
      autoSubmitOnEnter: true,
      showResetButton: false,
      schemas: [
        {
          label: '设备名称',
          field: `equipmentName`,
          component: 'Input',
          colProps: { span: 6 },
        },
      ],
    },
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    setDrawerProps({ confirmLoading: false });
    storeId.value = data.storeId;
    key.value = data.key;
    emit('load');
  });

  async function handleSubmit() {
    const selectRows = getSelectRows();

    if (selectRows.length) {
      emit('success', selectRows, key.value);
      closeDrawer();
    } else {
      message.error('请选择设备！');
    }
  }
</script>
