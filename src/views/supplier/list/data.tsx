import { FormProps, FormSchema } from '@/components/Table';
import { PmCompany } from '@/ApiModel/company/company';
import { createCompany, updateCompany } from '@/api/company/company';

export const AUTH_KEY = 'SupplierList';
export type TableResult = PmCompany;

export function getFormConfig(): Partial<FormProps> {
  return {
    autoSubmitOnEnter: true,
    rowProps: { gutter: 12 },
    labelWidth: 80,
    // showAdvancedButton: false,
    schemas: [
      {
        label: '供应商名称',
        field: `name`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '供应商编号',
        field: `code`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ],
  };
}

export const modalTitle = '供应商';
export type ActionKey = 'create' | 'edit';
export const createApi = createCompany;
export const updateApi = updateCompany;
export function getFormSchema(actionKey?: ActionKey): FormSchema[] {
  if (!actionKey) return [];
  return [];
}
