import { BasicColumn, FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '模板名称',
    dataIndex: 'name',
  },
  {
    title: '模板备注',
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '模板名称',
    component: 'Input',
    colProps: {
      xl: 12,
      xxl: 8,
    },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '模板名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'remark',
    label: '模板备注',
    component: 'InputTextArea',
  },
  {
    field: 'content',
    label: '模板内容',
    component: 'CodeEditor',
    required: true,
    componentProps: {
      autosize: true,
    },
  },
];
