import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '模板组名称',
    dataIndex: 'name',
  },
  {
    title: '模板组备注',
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '模板组名称',
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
    label: '模板组名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'remark',
    label: '模板组备注',
    component: 'InputTextArea',
  },
];
