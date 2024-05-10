import { h } from 'vue';
import { Tag, Badge } from 'ant-design-vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { Task } from '/@/api/system/task';

export type TableListItem = Task;

const getStatusColor = (status) => {
  switch (status) {
    case 0:
      return '#d9d9d9';
    case 1:
      return '#52c41a';
  }
};

const getStatusInfo = (status) => {
  switch (status) {
    case 0:
      return '停止';
    case 1:
      return '运行';
  }
};

export const columns: BasicColumn[] = [
  {
    title: '任务名称',
    dataIndex: 'name',
    width: 180,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ record }) => {
      return h(Badge, {
        status: record.status === 1 ? 'processing' : 'default',
        color: getStatusColor(record.status),
        text: getStatusInfo(record.status),
      });
    },
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 80,
    customRender: ({ record }) => {
      const text = record.type === 1 ? 'Interval' : 'Cron';
      return h(Tag, { color: 'processing' }, () => text);
    },
  },
  {
    title: '调用服务',
    dataIndex: 'service',
    width: 220,
  },
  {
    title: '执行参数',
    dataIndex: 'data',
    width: 220,
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: `name`,
    label: `任务名称`,
    component: 'Input',
    colProps: {
      sm: 12,
      md: 6,
    },
  },
  {
    field: `type`,
    label: `类型`,
    component: 'Select',
    componentProps: {
      options: [
        { label: 'Cron', value: 0 },
        { label: '时间间隔', value: 1 },
      ],
    },
    colProps: {
      sm: 12,
      md: 6,
    },
  },
  {
    field: 'service',
    component: 'Input',
    label: '调用服务',
    colProps: {
      sm: 12,
      md: 6,
    },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '运行', value: 1 },
        { label: '停用', value: 0 },
      ],
    },
    colProps: { span: 6 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'type',
    label: '类型',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: 'Cron', value: 0 },
        { label: '时间间隔', value: 1 },
      ],
    },
  },
  {
    field: 'name',
    label: '任务名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'service',
    label: '服务路径',
    component: 'Input',
    required: true,
  },
  {
    field: 'data',
    label: '任务参数',
    component: 'Input',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'limit',
    label: '执行次数',
    component: 'InputNumber',
    defaultValue: -1,
    componentProps: {
      min: -1,
    },
  },
  {
    field: 'cron',
    label: 'Cron',
    component: 'Input',
    componentProps: { placeholder: '请输入Cron表达式' },
    rules: [{ required: true, type: 'string' }],
    ifShow: ({ values }) => values.type === 0,
  },
  {
    field: 'every',
    component: 'InputNumber',
    label: '执行间隔',
    defaultValue: 60000,
    rules: [{ required: true, type: 'number' }],
    componentProps: {
      min: 100,
    },
    ifShow: ({ values }) => values.type === 1,
  },
  {
    field: 'startTime',
    label: '开始时间',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
    },
    ifShow: ({ values }) => values.type === 0,
  },
  {
    field: 'endTime',
    label: '结束时间',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
    },
    ifShow: ({ values }) => values.type === 0,
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '运行', value: 1 },
        { label: '停止', value: 0 },
      ],
    },
  },
];
