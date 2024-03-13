import { BasicColumn, FormSchema } from '@/components/Table';
import { createArea, getArea, updateArea } from '@/api/company/area';

export const AUTH_KEY = 'Organization';
export type TableResult = any;

export function getColumns(): BasicColumn<TableResult>[] {
  return [{ dataIndex: 'name', title: '姓名', width: 160 }];
}

export const modalTitle = '组织架构';
export type ActionKey = 'create' | 'edit';
export const createApi = createArea;
export const updateApi = updateArea;
export function getFormSchema(actionKey?: ActionKey): FormSchema[] {
  if (!actionKey) return [];
  return [
    {
      field: 'companyId',
      component: 'Input',
      show: false,
    },
    {
      label: '名称',
      field: 'name',
      component: 'Input',
      componentProps: {
        placeholder: '请输入名称',
      },
      rules: [{ required: true, message: '请输入名称' }],
      colProps: { span: 24 },
    },
    {
      label: '上级组织架构',
      field: 'parentId',
      component: 'ApiSelect',
      componentProps: {
        api: getArea,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请选择上层位置',
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
      rules: [{ required: true, message: '请选择状态' }],
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
  ];
}
