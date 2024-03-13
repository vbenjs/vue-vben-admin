import { FormSchema } from '@/components/Table';

export function getSelectBrandFormSchema(): FormSchema[] {
  return [
    {
      label: '集团',
      field: 'storeNumber',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: '品牌',
      field: 'storeNumber',
      component: 'Input',
      colProps: { span: 6 },
    },
  ];
}
