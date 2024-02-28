import { BasicColumn, FormProps } from '@/components/Table';
import { useOptionStore } from '@/store/modules/options';
import { formatToDateTime } from '@/utils/dateUtil';

const optionStore = useOptionStore();

export function getColumns(): BasicColumn[] {
  return [
    {
      title: '条码值',
      dataIndex: 'barcode',
      width: 300,
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      width: 160,
      sorter: true,
      customRender: ({ text }) => formatToDateTime(text),
    },
    {
      title: '接口类型',
      dataIndex: 'portType',
      width: 120,
      customRender: ({ text }) => optionStore.getOptionName(text, 'portType'),
    },
    {
      title: '错误类型',
      dataIndex: 'errType',
      width: 120,
      customRender: ({ text }) => optionStore.getOptionName(text, 'errType'),
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    autoSubmitOnEnter: true,
    // rowProps: { gutter: 12 },
    labelWidth: 80,
    submitOnChange: true,
    // showAdvancedButton: false,
    schemas: [
      {
        label: '条码',
        field: `barcode`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '创建时间',
        field: `createdTime`,
        component: 'MyRangePicker',
        componentProps: {
          valueFormat: 'YYYY-MM-DD',
          style: `width:100%;`,
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '接口类型',
        field: `portType`,
        component: 'ApiSelect',
        componentProps: {
          api: optionStore.initPortType,
          labelField: 'name',
          valueField: 'code',
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '错误类型',
        field: `errType`,
        component: 'ApiSelect',
        componentProps: {
          api: optionStore.initErrType,
          labelField: 'name',
          valueField: 'code',
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ],
  };
}
