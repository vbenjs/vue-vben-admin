import { Tag } from 'ant-design-vue';
import { BasicColumn, FormProps } from '@/components/Table';
import { formatLastTime, formatLastTimeColor } from '@/utils/dateUtil';
import { updateSensorMark } from '@/api/sensor';
import { SensorResult } from '@/api/model/sensorModel';
import LastValueVue from '@/views/components/LastValue.vue';
import { usePermission } from '@/hooks/web/usePermission';
import { useFormat } from '@/utils/format';
import { useEnumStore } from '@/store/modules/enum';

export const permissionCode = 'EquipmentSensor';

const { hasPermission } = usePermission();
const { formatGateway } = useFormat();
const enumStore = useEnumStore();

export function getColumns(): BasicColumn<SensorResult>[] {
  return [
    {
      dataIndex: 'remark',
      title: '备注',
      width: 200,
      edit: hasPermission(permissionCode + '_note'),
    },
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
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    autoSubmitOnEnter: true,
    rowProps: { gutter: 12 },
    labelWidth: 80,
    // showAdvancedButton: false,
    schemas: [
      {
        label: '地点',
        field: `storeInfo`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '传感器类型',
        field: `sensorType`,
        component: 'Select',
        componentProps: {
          options: enumStore.sensorTypeOptions,
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '网关编号',
        field: `terminalNum`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '传感器编号',
        field: `sensorNum`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '备注',
        field: `remark`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ],
  };
}

export const updateApi = updateSensorMark;
