import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '数据库名称',
    dataIndex: 'name',
  },
  {
    title: '数据库用户名',
    dataIndex: 'username',
  },
  {
    title: '数据库密码',
    dataIndex: 'password',
  },
  {
    title: '数据库目录',
    dataIndex: 'catalog',
  },
  {
    title: '数据库模式',
    dataIndex: 'schema',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '数据库名称',
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
    label: '数据库名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'url',
    label: '数据库连接',
    component: 'Input',
    required: true,
  },
  {
    field: 'username',
    label: '数据库用户名',
    component: 'Input',
    required: true,
  },
  {
    field: 'password',
    label: '数据库密码',
    component: 'InputPassword',
    required: true,
  },
  {
    field: 'catalog',
    label: '数据库目录',
    component: 'Input',
  },
  {
    field: 'schema',
    label: '数据库模式',
    component: 'Input',
  },
];
