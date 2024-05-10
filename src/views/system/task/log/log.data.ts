import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { formatToDateTime } from '/@/utils/dateUtil';

export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 40,
  },
  {
    title: '任务编号',
    dataIndex: ['task', 'id'],
    width: 80,
  },
  {
    title: '任务名称',
    dataIndex: ['task', 'name'],
    width: 140,
  },
  {
    title: '异常信息',
    dataIndex: 'detail',
  },
  {
    title: '耗时',
    dataIndex: 'consumeTime',
    width: 80,
    customRender: ({ record }) => {
      return h(Tag, {}, () => `${record.consumeTime}ms`);
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ record }) => {
      const status = record.status;
      const enable = ~~status === 1;
      const color = enable ? 'green' : 'red';
      const text = enable ? '成功' : '失败';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '执行时间',
    width: 165,
    dataIndex: 'createdAt',
    format: (text: string) => {
      return formatToDateTime(text);
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '任务名称',
    component: 'Input',
    colProps: {
      sm: 12,
      md: 6,
    },
  },
  {
    field: '异常信息',
    label: 'detail',
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
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '停用', value: 0 },
      ],
    },
    colProps: { span: 6 },
  },
];
