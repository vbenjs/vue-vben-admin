import { FormProps, FormSchema } from '@/components/Table';
import { PmCompany, PmCompanyForm } from '@/ApiModel/company/company';
import { createCompany, updateCompany } from '@/api/company/company';

export const AUTH_KEY = 'Group';
export type TableResult = PmCompany;

export function getFormConfig(): Partial<FormProps> {
  return {
    autoSubmitOnEnter: true,
    rowProps: { gutter: 12 },
    labelWidth: 80,
    // showAdvancedButton: false,
    schemas: [
      {
        label: '集团名称',
        field: `name`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '集团编号',
        field: `code`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ],
  };
}

export const modalTitle = '集团';
export type ActionKey = 'create' | 'edit';
export type FormValue = PmCompanyForm;
export const createApi = createCompany;
export const updateApi = updateCompany;
export function getFormSchema(actionKey?: ActionKey): FormSchema[] {
  if (!actionKey) return [];
  return [
    {
      label: '集团名称',
      field: 'name',
      component: 'Input',
      componentProps: {
        placeholder: '请输入集团名称',
      },
      rules: [{ required: true, message: '请输入集团名称' }],
      colProps: { span: 12 },
    },
    {
      label: '集团简称',
      field: 'shortName',
      component: 'Input',
      componentProps: {
        placeholder: '请输入集团简称',
      },
      colProps: { span: 12 },
    },
    {
      label: '集团编号',
      field: 'code',
      component: 'Input',
      componentProps: {
        placeholder: '请输入集团编号',
      },
      rules: [{ required: true, message: '请输入集团编号' }],
      colProps: { span: 12 },
    },
    {
      label: '集团短码',
      field: 'shortCode',
      component: 'Input',
      componentProps: {
        placeholder: '请输入集团短码',
      },
      colProps: { span: 12 },
    },
    {
      label: '邮箱',
      field: 'email',
      component: 'Input',
      componentProps: {
        placeholder: '请输入邮箱',
      },
      colProps: { span: 12 },
    },
    {
      label: '电话',
      field: 'phone',
      component: 'Input',
      componentProps: {
        placeholder: '请输入电话',
      },
      colProps: { span: 12 },
    },
    {
      label: '联系人',
      field: 'contract',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系人',
      },
      colProps: { span: 12 },
    },
    {
      label: '联系人电话',
      field: 'contractPhone',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系人电话',
      },
      colProps: { span: 12 },
    },
    {
      label: '统一社会信息用代码',
      field: 'uscCode',
      component: 'Input',
      componentProps: {
        placeholder: '请输入统一社会信息用代码',
      },
      colProps: { span: 12 },
    },
    {
      label: '营业执照有效期',
      field: 'uscExpired',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择营业执照有效期',
        style: { width: '100%' },
      },
      colProps: { span: 12 },
    },
    {
      label: '货币类型',
      field: 'currencyType',
      component: 'Input',
      componentProps: {
        placeholder: '请输入货币类型',
      },
      colProps: { span: 12 },
    },
    {
      label: '行业',
      field: 'industry',
      component: 'Input',
      componentProps: {
        placeholder: '请输入行业',
      },
      colProps: { span: 12 },
    },
    {
      label: '经营范围',
      field: 'businessScope',
      component: 'Input',
      componentProps: {
        placeholder: '请输入经营范围',
      },
      colProps: { span: 12 },
    },
    {
      label: '官网地址',
      field: 'website',
      component: 'Input',
      componentProps: {
        placeholder: '请输入网站',
      },
      colProps: { span: 12 },
    },
    {
      label: '省',
      field: 'province',
      component: 'Input',
      componentProps: {
        placeholder: '请输入省',
      },
      colProps: { span: 12 },
    },
    {
      label: '市',
      field: 'city',
      component: 'Input',
      componentProps: {
        placeholder: '请输入市',
      },
      colProps: { span: 12 },
    },
    {
      label: '区',
      field: 'area',
      component: 'Input',
      componentProps: {
        placeholder: '请输入区',
      },
      colProps: { span: 12 },
    },
    {
      label: '地址',
      field: 'address',
      component: 'Input',
      componentProps: {
        placeholder: '请输入地址',
      },
      colProps: { span: 12 },
    },
    {
      label: '备注',
      field: 'note',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注',
      },
      colProps: { span: 12 },
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
      colProps: { span: 12 },
    },
    {
      label: '上传 logo',
      field: 'logo',
      component: 'Upload',
      colProps: { span: 24 },
    },
    {
      label: '上传营业执照',
      field: 'logo',
      component: 'Upload',
      colProps: { span: 24 },
    },
  ];
}
