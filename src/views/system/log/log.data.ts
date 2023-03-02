import { h } from 'vue';

import { Tag } from 'ant-design-vue';

import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

import { YesNo } from '/@/enums/YesNo';

import dayjs from 'dayjs';

export const columns: BasicColumn[] = [
  {
    title: '模块名称',
    dataIndex: 'module',
  },
  {
    title: '日志内容',
    dataIndex: 'content',
  },
  {
    title: '用户id',
    dataIndex: 'userId',
  },
  {
    title: '状态',
    dataIndex: 'isSucceeded',
    customRender: ({ record }) => {
      const succeeded = record.isSucceeded === YesNo.YES;
      const color = succeeded ? 'green' : 'red';
      const text = succeeded ? '成功' : '失败';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '消耗时间(毫秒)',
    dataIndex: 'cost',
  },
  {
    title: '日志时间',
    dataIndex: 'logTime',
    customRender: ({ record }) => {
      return dayjs(record.logTime).format('YYYY-MM-DD HH:mm:ss');
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'module',
    label: '模块名称',
    component: 'Input',
    colProps: {
      xl: 6,
      xxl: 6,
    },
  },
  {
    field: 'isSucceeded',
    label: '状态',
    component: 'Select',
    colProps: {
      xl: 6,
      xxl: 6,
    },
    componentProps: {
      options: [
        { label: '成功', value: '1' },
        { label: '失败', value: '0' },
      ],
    },
  },
  {
    field: 'logTimeStart',
    label: '开始时间',
    component: 'DatePicker',
    colProps: {
      xl: 6,
      xxl: 6,
    },
    componentProps: {
      showTime: true,
      style: {
        width: '100%',
      },
    },
  },
  {
    field: 'logTimeEnd',
    label: '结束时间',
    component: 'DatePicker',
    colProps: {
      xl: 6,
      xxl: 6,
    },
    componentProps: {
      showTime: true,
      style: {
        width: '100%',
      },
    },
  },
];
