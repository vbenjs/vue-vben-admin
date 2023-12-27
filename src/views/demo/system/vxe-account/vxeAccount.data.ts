import { VxeFormItemProps, VxeGridPropTypes } from '@/components/VxeTable';
import { deptMap } from '../account/account.data';

export const columns: VxeGridPropTypes.Columns = [
  {
    title: '用户名',
    field: 'account',
    width: 120,
  },
  {
    title: '昵称',
    field: 'nickname',
    width: 120,
  },
  {
    title: '邮箱',
    field: 'email',
    width: 120,
  },
  {
    title: '创建时间',
    field: 'createTime',
    width: 180,
  },
  {
    title: '角色',
    field: 'role',
    width: 200,
  },
  {
    title: '所属部门',
    field: 'dept',
    slots: {
      default: ({ row }) => {
        return deptMap[row.dept];
      },
    },
  },
  {
    title: '备注',
    field: 'remark',
  },
  {
    width: 160,
    title: '操作',
    align: 'center',
    slots: { default: 'action' },
    fixed: 'right',
  },
];

export const searchFormSchema: VxeFormItemProps[] = [
  {
    field: 'account',
    title: '用户名',
    itemRender: {
      name: 'AInput',
    },
    span: 6,
  },
  {
    field: 'nickname',
    title: '昵称',
    itemRender: {
      name: 'AInput',
    },
    span: 6,
  },
  {
    span: 12,
    align: 'right',
    className: '!pr-0',
    itemRender: {
      name: 'AButtonGroup',
      children: [
        {
          props: { type: 'primary', content: '查询', htmlType: 'submit' },
          attrs: { class: 'mr-2' },
        },
        { props: { type: 'default', htmlType: 'reset', content: '重置' } },
      ],
    },
  },
];
