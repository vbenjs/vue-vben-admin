import { createStore, modifyStoreMonitor, updateStore } from '@/api/store';
import { BasicColumn, FormProps, FormSchema } from '@/components/Table';
import { formatToDate } from '@/utils/dateUtil';
import { StoreResult } from '@/api/model/storeModel';
import { StatusSwitch } from '@/components/Business';

export const AUTH_KEY = 'Brand';

export function getColumns(): BasicColumn<StoreResult>[] {
  return [
    { dataIndex: 'name', title: '品牌名称', width: 160 },
    {
      dataIndex: 'monitorStatus',
      title: '告警配置',
      width: 100,
      customRender: ({ record }) => {
        return (
          <StatusSwitch
            api={(checked) => modifyStoreMonitor([record.id], checked)}
            v-model:checked={record.monitorStatus}
            auth={`${AUTH_KEY}_enable`}
          />
        );
      },
    },
    { dataIndex: 'storeNumber', title: '品牌编号', width: 160 },
    // , {dataIndex: 'nonoperating', title: '非营业耗电监控', width: 150, templet: '#modifyNonoperatingTemplate'}
    { dataIndex: 'people', title: '联系人', width: 100 },
    { dataIndex: 'phone', title: '联系电话', width: 120 },
    {
      dataIndex: 'address',
      title: '地址',
      width: 360,
      customRender: ({ record: d }) => {
        return d.province + d.city + d.address;
      },
    },
    { dataIndex: 'remark', title: '介绍', minWidth: 300 },
    {
      dataIndex: 'startTime',
      title: '营业时间',
      width: 160,
      customRender: ({ record: d }) => {
        if (d.startTime && d.endTime) return d.startTime + ' - ' + d.endTime;
        return '';
      },
    },
    {
      dataIndex: 'createTime',
      title: '创建时间',
      width: 170,
      customRender: ({ text }) => formatToDate(text),
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    autoSubmitOnEnter: true,
    rowProps: { gutter: 12 },
    labelWidth: 80,
    // showAdvancedButton: false,
    schemas: [
      {
        label: '品牌名称',
        field: `name`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '品牌编号',
        field: `storeNumber`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: `people`,
        label: '联系人',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ],
  };
}

export const modalTitle = '品牌';
export type ActionKey = 'create' | 'edit';
export const createApi = createStore;
export const updateApi = updateStore;
export const getFormSchema: (city: any[], actionKey?: ActionKey) => FormSchema[] = (
  city,
  actionKey,
) => {
  if (!actionKey) return [];
  return [
    {
      label: '品牌编号',
      field: 'storeNumber',
      component: 'Input',
      componentProps: {
        placeholder: '请输入品牌编号',
      },
      rules: [{ required: true, message: '请输入品牌编号' }],
      colProps: { span: 24 },
    },
    {
      label: '品牌名称',
      field: 'name',
      component: 'Input',
      componentProps: {
        placeholder: '请输入品牌名称',
      },
      rules: [{ required: true, message: '请输入品牌名称' }],
      colProps: { span: 24 },
    },
    {
      label: '地址',
      field: 'city',
      component: 'Cascader',
      required: true,
      componentProps: {
        placeholder: '请选择地址',
        options: city,
      },
      colProps: { span: 24 },
    },
    {
      label: '详细地址',
      field: 'address',
      component: 'Input',
      componentProps: {
        placeholder: '请输入详细地址',
      },
      rules: [{ required: true, message: '请输入详细地址' }],
      colProps: { span: 24 },
    },
    {
      label: '联系人',
      field: 'people',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系人',
      },
      rules: [{ required: true, message: '请输入联系人' }],
      colProps: { span: 24 },
    },
    {
      label: '联系电话',
      field: 'phone',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系电话',
      },
      rules: [
        { required: true, message: '请输入联系电话' },
        { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
      ],
      colProps: { span: 24 },
    },
    {
      label: '开始营业时间',
      field: 'startTime',
      component: 'TimePicker',
      componentProps: {
        placeholder: '请选择开始营业时间',
        valueFormat: 'HH:mm',
        format: 'HH:mm',
        style: { width: '100%' },
      },
      rules: [{ required: true, message: '请选择营业时间' }],
      colProps: { span: 24 },
    },
    {
      label: '结束营业时间',
      field: 'endTime',
      component: 'TimePicker',
      componentProps: {
        placeholder: '请选择结束营业时间',
        valueFormat: 'HH:mm',
        format: 'HH:mm',
        style: { width: '100%' },
      },
      rules: [{ required: true, message: '请选择结束营业时间' }],
      colProps: { span: 24 },
    },
    {
      label: '备注',
      field: 'remark',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '请输入备注',
        autoSize: { minRows: 4 },
      },
      colProps: { span: 24 },
    },
  ];
};
