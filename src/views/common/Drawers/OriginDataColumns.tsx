import { BasicColumn } from '@/components/Table';
import { YNTag } from '@/components/Tag';
import { formatToDateTime } from '@/utils/dateUtil';
import { LastValue } from '../components';

const wnColumns: BasicColumn[] = [
  { dataIndex: 'uuid', title: '网关编号', minWidth: 200 },
  { dataIndex: 'nodeId', title: '传感器编号', width: 120 },
  {
    dataIndex: 'ts',
    title: '接收时间',
    width: 180,
    customRender: ({ text }) => formatToDateTime(text),
  },
  {
    dataIndex: 'value',
    title: '值',
    width: 200,
    customRender: ({ record }) => <LastValue data={JSON.stringify(record)} />,
  },
  { dataIndex: 'bat', title: '电量(0-6)', width: 100 },
];

const MultiBusColumns: BasicColumn[] = [
  { dataIndex: 'cardNumber', title: '网关编号', width: 200 },
  {
    dataIndex: 'nodeNumber',
    title: '节点号',
    width: 100,
    customRender: ({ text }) => {
      return text + '（' + parseInt(text, 16) + '）';
    },
  },
  {
    dataIndex: 'receiveTime',
    title: '接收时间',
    width: 180,
    customRender: ({ text }) => formatToDateTime(text),
  },
  {
    dataIndex: 'serialNumber',
    title: '数据序号',
    width: 180,
    customRender: ({ text }) => {
      return text + '（' + parseInt(text, 16) + '）';
    },
  },
  { dataIndex: 'durationTime', title: '时间(秒)', width: 120 },
  { dataIndex: 'ampere', title: '平均电流(A)', width: 120 },
  { dataIndex: 'electricalEnergy', title: '耗电(kW·h)', width: 120 },
  {
    dataIndex: 'repair',
    title: '补充数据',
    width: 100,
    customRender: ({ text }) => <YNTag text={text ? 'Y' : 'N'} />,
  },
];

const AirBoxColumns: BasicColumn[] = [
  { dataIndex: 'serial', title: '序列号', width: 150 },
  {
    dataIndex: 'ts',
    title: '接收时间',
    width: 180,
    customRender: ({ text }) => formatToDateTime(text),
  },
  {
    dataIndex: ['code', 'temperature'],
    title: '温度(℃)',
    width: 120,
  },
  {
    dataIndex: ['code', 'humidity'],
    title: '湿度(%)',
    width: 120,
  },
  {
    dataIndex: ['code', 'co2'],
    title: '二氧化碳(ppm)',
    width: 120,
  },
  {
    dataIndex: ['code', 'pm25'],
    title: 'PM2.5(ug/m³)',
    width: 120,
  },
  {
    dataIndex: ['code', 'formaldehyde'],
    title: '甲醛(ug/m³)',
    width: 120,
  },
  {
    dataIndex: ['code', 'tvoc'],
    title: 'TVOC(ug/m³)',
    width: 120,
  },
  {
    dataIndex: ['code', 'formaldehydeSensorTime'],
    title: '甲醛传感器累计使用时间(小时)',
    width: 120,
  },
  {
    dataIndex: 'ip',
    title: '设备内网IP地址',
    width: 150,
  },
  {
    dataIndex: 'ssid',
    title: '设备连接WIFI SSID',
    width: 150,
  },
  {
    dataIndex: 'rssi',
    title: '设备信号强度',
    width: 150,
  },
  {
    dataIndex: 'reason',
    title: '设备当前状态',
    width: 150,
  },
];

export const getOriginDataColumns = (type: string) => {
  if (type === 'AIR_BOX') return AirBoxColumns;
  if (type == 'MULTI_NODE') return MultiBusColumns;
  if (/^WM_.+$/.test(type)) return wnColumns;
  return [];
};
