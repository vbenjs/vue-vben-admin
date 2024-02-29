import { BasicColumn } from '@/components/Table';
import { formatToDateTime } from '@/utils/dateUtil';

const wnColumns: BasicColumn[] = [
  { dataIndex: 'uuid', title: '网关编号', minWidth: 150 },
  {
    dataIndex: 'ts',
    title: '接收时间',
    width: 180,
    customRender: ({ text }) => formatToDateTime(text),
  },
  {
    dataIndex: 'num',
    title: '节点数量',
    width: 100,
    customRender: ({ record }) => record.nodes?.length ?? 0,
  },
];

const MultiBusColumns: BasicColumn[] = [
  { dataIndex: 'cardNumber', title: '网关编号', width: 150 },
  {
    dataIndex: 'receiveTime',
    title: '接收时间',
    width: 180,
    customRender: ({ text }) => formatToDateTime(text),
  },
  {
    dataIndex: 'originData',
    title: '数据版本',
    width: 100,
    customRender: function ({ text }) {
      let version = '未知版本';
      if (!/.*FFFFFFFFFF$/.test(text)) {
        version = '无效数据';
      } else {
        var m = (text.length - 25) % 10;
        if (m == 0) version = 'V1.0';
        if (m == 4) version = 'V2.0';
      }
      return version;
    },
  },
  {
    dataIndex: 'originData',
    title: '卡号',
    width: 160,
    customRender: function ({ text }) {
      if (!/.*FFFFFFFFFF$/.test(text)) return '';
      return text.substring(0, 15);
    },
  },
  {
    dataIndex: 'originData',
    title: '包序号',
    width: 140,
    customRender: function ({ text }) {
      if (!/.*FFFFFFFFFF$/.test(text)) return '';
      var m = (text.length - 25) % 10;
      if (m == 4) {
        var sNumber = text.substring(15, 19);
        return sNumber + '(' + parseInt(sNumber, 16) + ')';
      }

      return '';
    },
  },
  {
    dataIndex: 'originData',
    title: '节点数量',
    width: 100,
    customRender: function ({ text }) {
      if (!/.*FFFFFFFFFF$/.test(text)) return '';
      return parseInt((text.length - 25) / 10);
    },
  },
];

const EdgexColumns: BasicColumn[] = [
  { dataIndex: 'gid', title: '网关编号', width: 150 },
  {
    dataIndex: 't',
    title: '接收时间',
    width: 180,
    customRender: ({ text }) => formatToDateTime(text),
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
    dataIndex: 'code',
    title: '数据类型',
    width: 120,
    customRender: ({ text }) => (text ? '上传数据' : '注册数据'),
  },
];

export const getOriginDataColumns = (type: string) => {
  if (type === 'MULTI_BUS') return MultiBusColumns;
  if (type === 'WN') return wnColumns;
  if (type === 'EDGEX') return EdgexColumns;
  if (type === 'AIR_BOX') return AirBoxColumns;
  return [];
};
