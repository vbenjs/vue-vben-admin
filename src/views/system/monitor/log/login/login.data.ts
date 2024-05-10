import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { formatToDateTime } from '/@/utils/dateUtil';

export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 60,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    width: 120,
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    width: 80,
    customRender: ({ record }) => {
      const color = 'blue';
      const text = record.ip;
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '登录地点',
    dataIndex: 'address',
    width: 80,
  },
  {
    title: '时间',
    width: 120,
    dataIndex: 'time',
    format: (text: string) => {
      return formatToDateTime(text);
    },
  },
  {
    title: '操作系统',
    dataIndex: 'os',
    width: 120,
  },
  {
    title: '浏览器',
    dataIndex: 'browser',
    width: 120,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    colProps: {
      sm: 12,
      md: 6,
    },
  },
  {
    field: 'ip',
    label: 'IP',
    component: 'Input',
    colProps: {
      sm: 12,
      md: 6,
    },
  },
  {
    field: 'address',
    label: '登录地点',
    component: 'Input',
    colProps: {
      sm: 12,
      md: 6,
    },
  },
  {
    field: 'time',
    component: 'RangePicker',
    label: '时间',
    colProps: {
      sm: 12,
      md: 6,
    },
  },
];
