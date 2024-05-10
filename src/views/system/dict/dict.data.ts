import { BasicColumn, FormSchema } from '/@/components/Table';
import { formatToDateTime } from '/@/utils/dateUtil';

export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    sorter: true,
    width: 60,
  },
  {
    title: '参数名称',
    width: 150,
    dataIndex: 'name',
  },
  {
    title: 'key',
    dataIndex: 'key',
  },
  {
    title: 'value',
    dataIndex: 'value',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '更新时间',
    width: 160,
    sorter: true,
    dataIndex: 'updatedAt',
    format: (text: string) => {
      return formatToDateTime(text);
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'name',
    component: 'Input',
    label: '参数名称',
    colProps: {
      span: 24,
    },
    required: true,
  },
  {
    field: 'key',
    component: 'Input',
    label: 'key',
    colProps: {
      span: 24,
    },
    required: true,
  },
  {
    field: 'value',
    component: 'Input',
    label: 'value',
    colProps: {
      span: 24,
    },
    required: true,
  },
  {
    field: 'remark',
    component: 'InputTextArea',
    label: '备注',
    colProps: {
      span: 24,
    },
    required: true,
  },
];
