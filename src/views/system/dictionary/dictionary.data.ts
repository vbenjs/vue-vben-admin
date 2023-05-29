import { BasicColumn, FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '字典代码',
    dataIndex: 'code',
  },
  {
    title: '字典名称',
    dataIndex: 'name',
  },
  {
    title: '字典备注',
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'codeLike',
    label: '字典代码',
    component: 'Input',
    colProps: {
      xl: 12,
      xxl: 8,
    },
  },
  {
    field: 'nameLike',
    label: '字典名称',
    component: 'Input',
    colProps: {
      xl: 12,
      xxl: 8,
    },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'code',
    label: '字典代码',
    component: 'Input',
    required: true,
  },
  {
    field: 'name',
    label: '字典名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'remark',
    label: '字典备注',
    component: 'InputTextArea',
  },
];
