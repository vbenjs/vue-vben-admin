import { updateBillInfo } from '@/api/warehouse/bill';
import { FormSchema } from '@/components/Form';

export const modalTitle = '单据信息';
export const updateApi = updateBillInfo;

export const getFormSchema: () => FormSchema[] = () => {
  return [
    {
      label: 'id',
      field: 'id',
      component: 'Input',
      show: false,
    },
    {
      label: '外部单据编号',
      field: 'outCode',
      component: 'Input',
      colProps: { span: 24 },
    },
    {
      label: '备注',
      field: 'note',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '请输入备注',
        autoSize: { minRows: 8 },
      },
      colProps: { span: 24 },
    },
  ];
};
