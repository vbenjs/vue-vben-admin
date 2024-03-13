import { BasicColumn, FormProps, FormSchema } from '@/components/Table';
import { StatusSwitch } from '@/components/Business';
import { createCompany, enabledCompany, updateCompany } from '@/api/company/company';

export const AUTH_KEY = 'WorkorderList';
export type TableResult = any;

export function getColumns(): BasicColumn<TableResult>[] {
  return [
    { dataIndex: 'name', title: '品牌名称', width: 160 },
    { dataIndex: 'code', title: '品牌编号', width: 100 },
    { dataIndex: 'contract', title: '联系人', width: 100 },
    { dataIndex: 'contractPhone', title: '联系电话', width: 140 },
    { dataIndex: 'businessScope', title: '经营范围', width: 160 },
    { dataIndex: 'website', title: '品牌官网', width: 160 },
    {
      dataIndex: 'enabled',
      title: '状态',
      width: 100,
      customRender: ({ record }) => {
        return (
          <StatusSwitch
            api={(checked) => enabledCompany([record.id], checked)}
            v-model:checked={record.enabled}
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
        label: '品牌名称',
        field: `name`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '品牌编号',
        field: ` code`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ],
  };
}

export const modalTitle = '工单';
export type ActionKey = 'create' | 'edit';
export const createApi = createCompany;
export const updateApi = updateCompany;
export function getFormSchema(actionKey?: ActionKey): FormSchema[] {
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
      label: '联系人',
      field: 'contract',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系人',
      },
      rules: [{ required: true, message: '请输入联系人' }],
      colProps: { span: 24 },
    },
    {
      label: '联系电话',
      field: 'contractPhone',
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
      label: '备注',
      field: 'note',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '请输入备注',
        autoSize: { minRows: 4 },
      },
      colProps: { span: 24 },
    },
    {
      label: '状态',
      field: 'enabled',
      component: 'Switch',
      componentProps: {
        checkedValue: 'Y',
        unCheckedValue: 'N',
      },
      defaultValue: 'Y',
    },
    {
      label: '上传 logo',
      field: 'logo',
      component: 'Upload',
      colProps: { span: 24 },
    },
  ];
}
