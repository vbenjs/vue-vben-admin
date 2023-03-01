import { h } from 'vue';

import { Tag } from 'ant-design-vue';

import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

import { YesNo } from '/@/enums/YesNo';

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
    title: '消耗时间',
    dataIndex: 'cost',
  },
  {
    title: '日志时间',
    dataIndex: 'logTime',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'module',
    label: '模块名称',
    component: 'Input',
    colProps: {
      xl: 12,
      xxl: 8,
    },
  },
  {
    field: 'isSucceeded',
    label: '状态',
    component: 'Select',
    colProps: {
      xl: 12,
      xxl: 8,
    },
    componentProps: {
      options: [
        { label: '成功', value: '1' },
        { label: '失败', value: '0' },
      ],
    },
  },
];
