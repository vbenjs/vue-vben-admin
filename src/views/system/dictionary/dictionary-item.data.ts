import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '字典项代码',
    dataIndex: 'code',
  },
  {
    title: '字典项名称',
    dataIndex: 'name',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '字典项名称',
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
    label: '字典项代码',
    component: 'Input',
    required: true,
  },
  {
    field: 'name',
    label: '字典项名称',
    component: 'Input',
    required: true,
  },
];
