import { StatusSwitch } from '@/components/Business';
import { BasicColumn, FormProps, FormSchema } from '@/components/Table';
import { HxCustomer } from '@/ApiModel/configuration/customer';
import { createCustomer, modifyCustomerStatus, updateCustomer } from '@/api/configuration/customer';

export type TableResult = HxCustomer;

export function getColumns(): BasicColumn<TableResult>[] {
  return [
    { title: '名称', dataIndex: 'name' },
    { title: '备注', dataIndex: 'note', width: 400 },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 80,
      customRender: ({ record }) => (
        <StatusSwitch
          api={(checked) => modifyCustomerStatus([record.id], checked)}
          v-model:checked={record.enabled}
          auth="customer_enabled"
        />
      ),
    },
    {
      title: '排序',
      dataIndex: 'sortNum',
      width: 60,
      sorter: true,
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    autoSubmitOnEnter: true,
    submitOnChange: true,
    rowProps: { gutter: 12 },
    labelWidth: 80,
    // showAdvancedButton: false,
    schemas: [
      {
        label: '名称',
        field: `name`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: 'enabled',
        label: '启用',
        component: 'Select',
        componentProps: {
          options: [
            { label: '是', value: 'Y' },
            { label: '否', value: 'N' },
          ],
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ],
  };
}

export const modalTitle = '客户';
export type ActionKey = 'create' | 'edit';
export const createApi = createCustomer;
export const updateApi = updateCustomer;

export const getFormSchema: (actionKey?: ActionKey) => FormSchema[] = (actionKey) => {
  if (!actionKey) return [];
  return [
    {
      label: '名称',
      field: 'name',
      component: 'Input',
      componentProps: {
        placeholder: '名称',
      },
      rules: [{ required: true, message: '请输入名称' }],
      colProps: { span: 24 },
    },
    {
      label: '启用/禁用',
      field: 'enabled',
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
    {
      label: '排序',
      field: 'sortNum',
      component: 'InputNumber',
      componentProps: {
        style: 'width:100%',
        // controls: false,
        min: 0,
        precision: 0,
      },
      defaultValue: 0,
      colProps: { span: 24 },
    },
    {
      label: '备注',
      field: 'note',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '请输入备注',
        autoSize: { minRows: 5 },
      },
      colProps: { span: 24 },
    },
  ];
};
