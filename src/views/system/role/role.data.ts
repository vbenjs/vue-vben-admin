import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { formatToDateTime } from '/@/utils/dateUtil';

export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '角色值',
    dataIndex: 'value',
    width: 180,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    customRender: ({ record }) => {
      const status = record.status;
      const enable = ~~status === 1;
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '停用';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 180,
    format: (text) => {
      return formatToDateTime(text);
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [];

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: '角色ID',
    show: false,
    component: 'Input',
  },
  {
    field: 'name',
    label: '角色名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'value',
    label: '角色值',
    required: true,
    component: 'Input',
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '停用', value: 0 },
      ],
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
  {
    label: ' ',
    field: 'menus',
    slot: 'menus',
    colProps: { span: 24 },
    component: 'Input',
  },
];
