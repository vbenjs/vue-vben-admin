import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import Icon from '@/components/Icon/Icon.vue';
import { formatToDateTime } from '/@/utils/dateUtil';
import { constantRouterComponents } from '/@/router/helper/routeHelper';

export const columns: BasicColumn[] = [
  {
    title: '菜单名称',
    dataIndex: 'name',
    width: 200,
    align: 'left',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 50,
    customRender: ({ record }) => {
      if (record.icon) {
        return h(Icon, { icon: record.icon });
      }
    },
  },
  {
    title: '排序',
    dataIndex: 'orderNo',
    width: 50,
  },
  {
    title: '权限标识',
    dataIndex: 'permission',
    width: 180,
  },
  {
    title: '路由',
    dataIndex: 'path',
    width: 180,
  },
  {
    title: '组件',
    dataIndex: 'component',
  },
  {
    title: '缓存',
    dataIndex: 'keepalive',
    width: 80,
    defaultHidden: true,
    customRender: ({ record }) => {
      const status = record.keepalive;
      const enable = ~~status === 1;
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '停用';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '是否显示',
    dataIndex: 'show',
    width: 80,
    customRender: ({ record }) => {
      const show = record.show;
      const enable = ~~show === 1;
      const color = enable ? 'green' : 'red';
      const text = enable ? '显示' : '隐藏';
      return h(Tag, { color: color }, () => text);
    },
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
    title: '更新时间',
    dataIndex: 'updatedAt',
    width: 180,
    defaultHidden: true,
    format: (text) => {
      return formatToDateTime(text);
    },
  },
];

const isDir = (type: number) => type === 0;
const isMenu = (type: number) => type === 1;
const isButton = (type: number) => type === 2;

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '菜单名称',
    component: 'Input',
    colProps: { sm: 12, xl: 6 },
  },
  {
    field: 'path',
    label: '路由',
    component: 'Input',
    colProps: { sm: 12, xl: 6 },
  },
  {
    field: 'permission',
    label: '权限标识',
    component: 'Input',
    colProps: { sm: 12, xl: 6 },
  },
  {
    field: 'component',
    label: '组件',
    component: 'Input',
    colProps: { sm: 12, xl: 6 },
  },
  // {
  //   field: 'status',
  //   label: '状态',
  //   component: 'Select',
  //   componentProps: {
  //     options: [
  //       { label: '启用', value: 1 },
  //       { label: '停用', value: 0 },
  //     ],
  //   },
  //   colProps: { span: 6 },
  // },
];

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: '菜单ID',
    show: false,
    component: 'Input',
  },
  {
    field: 'type',
    label: '菜单类型',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '目录', value: 0 },
        { label: '菜单', value: 1 },
        { label: '权限', value: 2 },
      ],
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'name',
    label: '菜单名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'parent',
    label: '上级菜单',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'name',
        // key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'orderNo',
    label: '排序',
    component: 'InputNumber',
    defaultValue: 0,
  },
  {
    field: 'icon',
    label: '图标',
    component: 'IconPicker',
    ifShow: ({ values }) => !isButton(values.type),
  },

  {
    field: 'path',
    label: '路由地址',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => !isButton(values.type),
  },
  {
    field: 'component',
    label: '组件路径',
    component: 'Select',
    helpMessage: ['根据views下的index.vue作为组件路径'],
    ifShow: ({ values }) => isMenu(values.type),
    componentProps: {
      options: Object.keys(constantRouterComponents).map((n) => ({ label: n, value: n })),
      showSearch: true,
    },
  },
  {
    field: 'permission',
    label: '权限标识',
    component: 'Input',
    ifShow: ({ values }) => !isDir(values.type),
    required: ({ values }) => isButton(values.type),
  },
  {
    field: 'external',
    label: '是否外链',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
    ifShow: ({ values }) => !isButton(values.type),
  },
  {
    field: 'keepalive',
    label: '是否缓存',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
    ifShow: ({ values }) => isMenu(values.type),
  },

  {
    field: 'show',
    label: '是否显示',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    helpMessage: '会生成路由,但左侧菜单不可见',
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
    ifShow: ({ values }) => !isButton(values.type),
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    helpMessage: '不会生成路由,同时左侧菜单不可见',
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  },
];
