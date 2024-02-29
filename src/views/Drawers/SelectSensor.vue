<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="title"
    :width="1000"
    destroyOnClose
    ok-text="选择"
    @ok="handleSubmit"
    showFooter
  >
    <BasicTable @register="registerTable" class="!p-0" showSelectionBar />
  </BasicDrawer>
</template>
<script lang="tsx" setup>
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicTable, TableRowSelection, useTable } from '@/components/Table';
  import { ref } from 'vue';
  import { formatLastTime, formatLastTimeColor } from '@/utils/dateUtil';
  import { Tag, message } from 'ant-design-vue';
  import LastValueVue from '@/views/components/LastValue.vue';
  import { getSensor } from '@/api/sensor';
  import { useFormat } from '@/utils/format';
  import { useEnumStore } from '@/store/modules/enum';

  const storeId = ref<number>(0);
  const key = ref<'bind' | 'change'>('bind');
  const sensorType = ref('');
  const enumStore = useEnumStore();

  const rowSelection = ref<TableRowSelection>();
  const title = ref('');

  const emit = defineEmits(['load', 'register', 'success']);
  const props = defineProps({
    api: {
      type: Function,
      default: getSensor,
    },
  });

  const { formatGateway } = useFormat();

  const [registerTable, { getSelectRows, getForm }] = useTable({
    api: (where) => props.api(where, true),
    beforeFetch: (where) => {
      where.storeId = storeId.value;
      where.bindingEquipment = 'N';
      return where;
    },
    columns: [
      {
        dataIndex: 'gateway',
        title: '网关',
        width: 260,
        customRender: ({ text }) => formatGateway(text),
      },
      {
        dataIndex: 'sensorType',
        title: '传感器类型',
        width: 160,
        customRender: ({ text }) => enumStore.sensorTypeMap.get(text),
      },
      {
        dataIndex: 'sensorNum',
        title: '传感器编号',
        width: 120,
        customRender: ({ record: d }) => {
          if (d.sensorType == 'MULTI_NODE')
            return d.sensorNum + '（' + parseInt(d.sensorNum, 16) + '）';
          return d.sensorNum;
        },
      },
      {
        dataIndex: 'lastDataTime',
        title: '最近通信时间',
        width: 120,
        customRender: ({ text }) => (
          <Tag color={formatLastTimeColor(text)}>{formatLastTime(text)}</Tag>
        ),
      },
      {
        dataIndex: 'lastData',
        title: '最近值',
        width: 220,
        customRender: ({ text }) => <LastValueVue data={text}></LastValueVue>,
      },
      {
        dataIndex: 'bat',
        title: '电量',
        width: 100,
        customRender: ({ record: d }) => {
          if (!d.lastData) return '';
          const lastData = JSON.parse(d.lastData);
          //温湿度，光，，，
          // == 'WM_TEMP_HUM' || d.sensorType == 'WM_TEMP'
          if (/^WM_.+$/.test(d.sensorType)) {
            const bat = Number(((lastData.bat * 100) / 6).toFixed(1));
            if (lastData.bat >= 3) {
              return <Tag color="green">{bat}%</Tag>;
            } else if (lastData.bat >= 1) {
              return <Tag color="orange">{bat}%</Tag>;
            } else {
              return <Tag>{bat}%</Tag>;
            }
          }
          return '';
        },
      },
    ],
    rowKey: 'id',
    size: 'small',
    loading: true,
    showIndexColumn: false,
    rowSelection: rowSelection,
    // pagination: { hideOnSinglePage: true },
    resizeHeightOffset: 60,
    useSearchForm: true,
    formConfig: {
      autoSubmitOnEnter: true,
      showResetButton: false,
      schemas: [
        {
          label: '网关编号',
          field: `terminalNum`,
          component: 'Input',
          colProps: { span: 6 },
        },
        {
          label: '传感器类型',
          field: `sensorType`,
          component: 'Select',
          colProps: { span: 6 },
        },
        {
          label: '传感器编号',
          field: `sensorNum`,
          component: 'Input',
          colProps: { span: 6 },
        },
      ],
    },
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    setDrawerProps({ confirmLoading: false });
    const { multiple } = data;
    rowSelection.value = { type: multiple ? 'checkbox' : 'radio' };
    title.value = data.title;
    storeId.value = data.storeId;
    key.value = data.key === 'change' ? 'change' : 'bind';
    sensorType.value = data.sensorType;
    getForm().updateSchema({
      field: `sensorType`,
      componentProps: {
        options: enumStore.sensorTypeOptions,
        disabled: !!data.sensorType,
        showArrow: !data.sensorType,
      },
      defaultValue: data.sensorType,
    });
  });

  async function handleSubmit() {
    const selectRows = getSelectRows();

    if (selectRows.length) {
      emit('success', selectRows, key.value);
      closeDrawer();
    } else {
      message.error('请选择传感器！');
    }
  }
</script>
