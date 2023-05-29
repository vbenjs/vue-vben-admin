import { BasicColumn, FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'username',
    width: 120,
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    width: 120,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'usernameLike',
    label: '用户名',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'nicknameLike',
    label: '昵称',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: '用户id',
    component: 'Input',
    show: false,
  },
  {
    field: 'username',
    label: '用户账号',
    component: 'Input',
    required: true,
  },
  {
    field: 'nickname',
    label: '用户昵称',
    component: 'Input',
    required: true,
  },
  {
    field: 'plainPassword',
    label: '用户密码',
    component: 'InputPassword',
    required: true,
    defaultValue: '123456',
    ifShow: ({ model }) => !model.id,
  },
  {
    field: 'email',
    label: '用户邮箱',
    component: 'Input',
  },
  {
    field: 'mobile',
    label: '用户手机',
    component: 'Input',
  },
  {
    field: 'remark',
    label: '用户备注',
    component: 'InputTextArea',
  },
];
