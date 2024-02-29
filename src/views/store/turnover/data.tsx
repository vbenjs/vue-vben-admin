import { BasicColumn, FormProps, FormSchema } from '@/components/Table';
import { formatToDate } from '@/utils/dateUtil';
import { updateStorePowerMonth } from '@/api/storePowerMonth';

export function getColumns(): BasicColumn[] {
  return [
    { dataIndex: 'storeName', title: '地点名称', width: 160 },
    { dataIndex: 'storeNumber', title: '地点编号', width: 160 },
    {
      dataIndex: 'noteTime',
      title: '月份',
      width: 100,
      customRender: ({ text }) => formatToDate(text, 'YYYY-MM'),
    },

    {
      dataIndex: 'electricalEnergyUltimo',
      title: '上月度数(kW·h)',
      width: 160,
    },
    {
      dataIndex: 'electricalEnergyTheSameMonth',
      title: '当月度数(kW·h)',
      width: 160,
    },

    { dataIndex: 'turnover', title: '营业额(元)', width: 160 },
    { dataIndex: 'remark', title: '备注', width: 160 },
    {
      dataIndex: 'createTime',
      title: '创建时间',
      width: 190,
      customRender: ({ text }) => formatToDate(text),
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    autoSubmitOnEnter: true,
    schemas: [
      {
        label: '月份',
        field: `noteTime`,
        component: 'DatePicker',
        componentProps: {
          picker: 'month',
          valueFormat: 'YYYY-MM',
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ],
  };
}

export const modalTitle = '明细';
export type ActionKey = 'create' | 'edit';
export const createApi = updateStorePowerMonth;
export const updateApi = updateStorePowerMonth;
export const getFormSchema: () => FormSchema[] = () => {
  return [
    {
      label: '月份',
      field: 'noteTime',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择单据月份',
        picker: 'month',
        valueFormat: 'YYYY-MM',
        style: 'width:100%',
      },
      rules: [{ required: true, message: '请选择月份' }],
      colProps: { span: 24 },
    },
    {
      field: 'turnover',
      label: '营业额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入营业额',

        style: 'width:100%',
        min: 0,
        precision: 0,
        controls: false,
      },
      suffix: '元',
      rules: [{ required: true, message: '请输入营业额' }],
      colProps: { span: 24 },
    },
    {
      field: 'electricalEnergyUltimo',
      label: '上月度数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入上月度数',
        style: 'width:100%',
        min: 0,
        precision: 0,
        controls: false,
      },
      suffix: 'kW·h',
      rules: [{ required: true, message: '请输入上月度数' }],
      colProps: { span: 24 },
    },
    {
      field: 'electricalEnergyTheSameMonth',
      label: '当月度数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入当月度数',
        style: 'width:100%',
        min: 0,
        precision: 0,
        controls: false,
      },
      suffix: 'kW·h',
      rules: [{ required: true, message: '请输入当月度数' }],
      colProps: { span: 24 },
    },
    {
      label: '备注',
      field: 'remark',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '请输入备注',
        autoSize: { minRows: 6 },
      },
      colProps: { span: 24 },
    },
  ];
};
