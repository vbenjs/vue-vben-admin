import { BasicColumn, FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '角色代码',
    dataIndex: 'code',
  },
  {
    title: '角色名称',
    dataIndex: 'name',
  },
  {
    title: '角色备注',
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'codeLike',
    label: '角色代码',
    component: 'Input',
    colProps: {
      xl: 12,
      xxl: 8,
    },
  },
  {
    field: 'nameLike',
    label: '角色名称',
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
    label: '角色代码',
    component: 'Input',
    required: true,
  },
  {
    field: 'name',
    label: '角色名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'remark',
    label: '角色备注',
    component: 'InputTextArea',
  },
];
