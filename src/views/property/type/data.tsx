import { createStore, modifyStoreMonitor, updateStore } from '@/api/store';
import { BasicColumn, FormProps, FormSchema } from '@/components/Table';
import { StatusSwitch } from '@/components/Business';

export const AUTH_KEY = 'PropertyType';
export type TableResult = any;

export function getColumns(): BasicColumn<TableResult>[] {
  return [
    { dataIndex: 'people', title: '分类名称', width: 160 },
    { dataIndex: 'phone', title: '所属类型', width: 160 },
    { dataIndex: 'note', title: '备注' },
    {
      dataIndex: 'enable',
      title: '启用',
      width: 80,
      customRender: ({ record }) => {
        return (
          <StatusSwitch
            api={(checked) => modifyStoreMonitor([record.id], checked)}
            v-model:checked={record.enable}
            auth={`${AUTH_KEY}_enable`}
          />
        );
      },
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
        field: 'people',
        label: '分类名称',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: 'phone',
        label: '所属类型',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: 'enable',
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

export const modalTitle = '资产分类';
export type ActionKey = 'create' | 'edit';
export const createApi = createStore;
export const updateApi = updateStore;
export function getFormSchema(actionKey?: ActionKey): FormSchema[] {
  if (!actionKey) return [];
  return [
    {
      field: 'people',
      label: '分类名称',
      component: 'Input',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'phone',
      label: '所属类型',
      component: 'Input',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'note',
      label: '备注',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '请输入备注',
        autoSize: { minRows: 4 },
      },
      colProps: { span: 24 },
    },
    {
      field: 'enable',
      label: '启用',
      component: 'Switch',
      componentProps: {
        checkedValue: 'Y',
        unCheckedValue: 'N',
      },
      defaultValue: 'Y',
      colProps: { span: 24 },
    },
  ];
}
