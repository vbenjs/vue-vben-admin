import { debounce } from 'lodash-es';
import { sortRole } from '@/api/system/roles';
import Icon from '@/components/Icon/Icon.vue';
import { FormProps, FormSchema } from '@/components/Table';
import { BasicColumn } from '@/components/Table/src/types/table';
import { formatToDateTime } from '@/utils/dateUtil';
import { dragSort } from '@/utils/dragSort';
import { YNTag } from '@/components/Tag';

const saveSort = debounce(function (array: Array<any>) {
  const sortData = array.map((item) => {
    return { id: item.id, sortNum: item.sortNum };
  });
  sortRole(sortData);
}, 0);
export function getRoleColumns(getDataSource: Function, setTableData: Function): BasicColumn[] {
  return [
    {
      title: '排序',
      key: 'icon',
      width: 60,
      customRender: () => <Icon icon="ant-design:menu-outlined" />,
      customCell: (record) => {
        return dragSort(record, getDataSource(), (array) => setTableData(array), saveSort);
      },
    },
    { title: '角色名称', dataIndex: 'name', width: '120px' },
    { title: '角色编码', dataIndex: 'code', width: '100px' },
    {
      title: '系统默认',
      dataIndex: 'sysDefault',
      width: 100,
      customRender: ({ text }) => <YNTag text={text} />,
    },
    { title: '备注', dataIndex: 'note' },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      width: 180,
      customRender: ({ text }) => formatToDateTime(text),
    },
    { title: '创建者', dataIndex: 'createdBy', width: '80px' },
    {
      title: '更新时间',
      dataIndex: 'updatedTime',
      width: 180,
      customRender: ({ text }) => formatToDateTime(text),
    },
    { title: '更新者', dataIndex: 'updatedBy', width: '80px' },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    autoSubmitOnEnter: true,
    submitOnChange: true,
    schemas: [
      {
        field: `name`,
        label: '角色名称',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: 'code',
        label: '角色编码',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ],
  };
}

export const roleSchemas: FormSchema[] = [
  {
    field: 'name',
    label: '角色名称',
    component: 'Input',
    rules: [{ required: true, message: '请输入角色名称' }],
    colProps: { span: 24 },
  },
  {
    field: 'code',
    label: '角色编码',
    component: 'Input',
    componentProps: {
      placeholder: '支持字母、数字、下划线',
    },
    rules: [
      {
        required: true,
        pattern: /^[0-9a-zA-Z_]{1,}$/,
        message: '请输入正确的角色编码,支持字母、数字、下划线',
      },
    ],
    colProps: { span: 24 },
  },
  {
    field: 'permissions',
    label: '角色权限',
    slot: 'auth',
    colProps: { span: 24 },
  },
  {
    label: '角色说明',
    field: 'note',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '',
    field: 'sortNum',
    component: 'Input',
    show: false,
  },
];
