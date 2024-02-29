import { FormProps, FormSchema } from '@/components/Form';
import { BasicColumn } from '@/components/Table';
import { usePermission } from '@/hooks/web/usePermission';
import { RemindMessageResult } from '@/api/remind/model/message';
import {
  createRemindMessage,
  enabledRemindMessage,
  getRemindMessageById,
  updateRemindMessage,
} from '@/api/remind/message';
import { useEnumStore } from '@/store/modules/enum';
import { StatusSwitch } from '@/components/Business';

const { hasPermission } = usePermission();
const hadWxPermission = hasPermission('RemindMessage_wx');

const enumStore = useEnumStore();

export function getColumns(): BasicColumn<RemindMessageResult>[] {
  return [
    {
      title: '标题',
      dataIndex: 'title',
      width: 150,
    },
    {
      title: '消息类型',
      dataIndex: 'messageType',
      width: 120,
      customRender: ({ record }) => enumStore.messageTypeMap.get(record.messageType),
    },
    {
      title: '消息编码',
      dataIndex: 'messageCode',
      width: 120,
    },
    {
      title: '启用',
      dataIndex: 'enabled',
      width: 80,
      customRender: ({ record }) => {
        return (
          <StatusSwitch
            api={(checked) => enabledRemindMessage([record.id], checked)}
            v-model:checked={record.enabled}
            auth="RemindMessage_update"
          />
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'mark',
    },
    {
      title: '排序',
      dataIndex: 'sortNum',
      width: 80,
      sorter: true,
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    autoSubmitOnEnter: true,
    rowProps: {
      gutter: 16,
    },
    // showAdvancedButton: false,
    schemas: [
      {
        label: '标题',
        field: `title`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '消息类型',
        field: `messageType`,
        component: 'Select',
        componentProps: {
          options: enumStore.messageTypeOptions,
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '消息编码',
        field: `messageCode`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: `enabled`,
        label: '启用',
        component: 'Select',
        componentProps: {
          options: [
            { label: '启用', value: 'Y' },
            { label: '禁用', value: 'N' },
          ],
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ],
  };
}

export const modalTitle = '消息通知方式';
export type ActionKey = 'create' | 'edit' | 'copy';
export const createApi = createRemindMessage;
export const updateApi = updateRemindMessage;
export const getItemApi = getRemindMessageById;
export type ItemResult = RemindMessageResult;
export const getFormSchema: (actionKey?: ActionKey) => FormSchema[] = (actionKey) => {
  if (!actionKey) return [];
  return [
    {
      field: `title`,
      label: '标题',
      component: 'Input',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: `messageType`,
      label: '消息类型',
      component: 'Select',
      required: true,
      componentProps: {
        options: enumStore.messageTypeOptions,
      },
      colProps: { span: 24 },
    },
    {
      field: `showTemp`,
      label: '查看模板',
      component: 'Select',
      colProps: { span: 24 },
      ifShow: ({ model }) => model.messageType === 'WX' && hadWxPermission,
      slot: 'showTemp',
    },
    {
      field: `messageCode`,
      label: '消息编码',
      component: 'Input',
      colProps: { span: 24 },
    },
    {
      field: `content`,
      label: '内容',
      component: 'InputTextArea',
      componentProps: {
        autoSize: { minRows: 4 },
      },
      colProps: { span: 24 },
    },
    {
      field: `mark`,
      label: '备注',
      component: 'InputTextArea',
      componentProps: {
        autoSize: { minRows: 4 },
      },
      colProps: { span: 24 },
    },
    {
      field: `sortNum`,
      label: '排序',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
        controls: false,
        style: { width: '100%' },
      },
      defaultValue: 0,
      colProps: { span: 24 },
    },
  ];
};
