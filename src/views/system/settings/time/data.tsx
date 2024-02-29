import { FormProps, FormSchema } from '@/components/Form';
import { BasicColumn } from '@/components/Table';
import { createBusinessTime, enabledBusinessTime, updateBusinessTime } from '@/api/businessTime';
import { BusinessTimeResult } from '@/api/model/bussinessTimeModel';
import { StatusSwitch } from '@/components/Business';

export function getColumns(): BasicColumn<BusinessTimeResult>[] {
  return [
    {
      title: '备注',
      dataIndex: 'remark',
      width: 150,
    },
    {
      title: '用电时间',
      dataIndex: 'time',
      width: 120,
      customRender: ({ record }) => {
        return [record.startTime, record.endTime].join(' - ');
      },
    },
    {
      title: '启用',
      dataIndex: 'status',
      width: 80,
      customRender: ({ record }) => {
        return (
          <StatusSwitch
            api={(checked) => enabledBusinessTime([record.id], checked)}
            v-model:checked={record.status}
            auth="BusinessTime_update"
          />
        );
      },
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
        label: '备注',
        field: `remark`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ],
  };
}

export const modalTitle = '用电时间';
export type ActionKey = 'create' | 'edit';
export const createApi = createBusinessTime;
export const updateApi = updateBusinessTime;
export const getFormSchema: (actionKey?: ActionKey) => FormSchema[] = (actionKey) => {
  if (!actionKey) return [];
  return [
    {
      label: '开始用电时间',
      field: `startTime`,
      component: 'TimePicker',
      componentProps: {
        valueFormat: 'HH:mm:ss',
        style: 'width:100%',
      },
      required: true,
      colProps: { span: 24 },
    },
    {
      label: '结束用电时间',
      field: `endTime`,
      component: 'TimePicker',
      componentProps: {
        valueFormat: 'HH:mm:ss',
        style: 'width:100%',
      },
      required: true,
      colProps: { span: 24 },
    },
    {
      field: `remark`,
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
    {
      field: `status`,
      label: '启用',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '启用', value: 'Y' },
          { label: '禁用', value: 'N' },
        ],
      },
      defaultValue: 'Y',
      colProps: { span: 24 },
    },
  ];
};
