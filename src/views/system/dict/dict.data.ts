import { h } from 'vue';
import { Switch } from 'ant-design-vue';

import { BasicColumn, FormSchema } from '@/components/Table';
import { useMessage } from '@/hooks/web/useMessage';
import { AvailableStatus } from '@/utils/constants';
import { saveDict } from '@/api/sys/dict';

type CheckedType = boolean | string | number;
export const columns: BasicColumn[] = [
  {
    title: '字典名称',
    dataIndex: 'name',
    width: 160,
    align: 'left',
  },
  {
    title: '字典类型',
    dataIndex: 'type',
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
          saveDict({ status: newStatus }, record.id)
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
    field: 'name',
    label: '字典名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'type',
    label: '字典类型',
    component: 'Input',
    required: true,
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
];
