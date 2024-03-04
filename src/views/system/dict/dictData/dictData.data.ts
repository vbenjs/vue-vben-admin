import { h } from 'vue';
import { Switch, Tag } from 'ant-design-vue';

import { BasicColumn, FormSchema } from '@/components/Table';
import { useMessage } from '@/hooks/web/useMessage';
import { AvailableStatus } from '@/utils/constants';
import { saveDictData } from '@/api/sys/dictData';
import { getDictList } from '@/api/sys/dict';

type CheckedType = boolean | string | number;
export const columns: BasicColumn[] = [
  {
    title: '字典类型',
    dataIndex: 'type',
    width: 160,
    align: 'left',
    customRender: ({ record }) => {
      return h(Tag, { color: 'green' }, () => record.sysDict.name);
    },
  },
  {
    title: '数据名称',
    dataIndex: 'label',
    width: 160,
    align: 'left',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(Switch, {
        checked: record.status === AvailableStatus.NORMAL,
        checkedChildren: '启用',
        unCheckedChildren: '停用',
        loading: record.pendingStatus,
        onChange(checked: CheckedType) {
          record.pendingStatus = true;
          const newStatus = checked ? AvailableStatus.NORMAL : AvailableStatus.FORBIDDEN;
          const { createMessage } = useMessage();
          saveDictData({ status: newStatus }, record.id)
            .then(() => {
              record.status = newStatus;
              createMessage.success(`修改成功`);
            })
            .catch(() => {
              createMessage.error('修改失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '补充数据',
    dataIndex: 'extra',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'q',
    label: '名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: AvailableStatus.NORMAL },
        { label: '停用', value: AvailableStatus.FORBIDDEN },
      ],
    },
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'type',
    label: '字典类型',
    component: 'ApiSelect',
    componentProps: {
      api: async () => {
        const dictList = await getDictList({ isAll: true });
        return dictList.list;
      },
      labelField: 'name',
      valueField: 'type',
    },
    required: true,
  },
  {
    field: 'label',
    label: '数据名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'value',
    label: '数据值',
    component: 'Input',
    required: true,
  },
  {
    field: 'sort',
    label: '数据排序',
    component: 'InputNumber',
    required: false,
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: AvailableStatus.NORMAL,
    componentProps: {
      options: [
        { label: '启用', value: AvailableStatus.NORMAL },
        { label: '停用', value: AvailableStatus.FORBIDDEN },
      ],
    },
    required: true,
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
  {
    label: '补充数据',
    field: 'extra',
    helpMessage: ['支持json'],
    component: 'InputTextArea',
  },
];
