import { HxPrinter } from '@/ApiModel/configuration/printer';
import {
  createPrinter,
  getAllPrinter,
  modifyPrinterStatus,
  updatePrinter,
} from '@/api/configuration/printer';
import { BasicHelp } from '@/components/Basic';
import { StatusSwitch } from '@/components/Business';
import { FormProps, FormSchema } from '@/components/Form';
import { BasicColumn } from '@/components/Table';
import { Space, Tag } from 'ant-design-vue';

export type TableResult = HxPrinter;

export function getColumns(): BasicColumn<TableResult>[] {
  return [
    { title: '打印机名称', dataIndex: 'name', width: 220 },
    {
      title: '主机名称',
      dataIndex: 'name',
      width: 260,
      resizable: true,
      customRender: ({ record }) => {
        return (
          <Space>
            <div>{record.hostname}</div>
            <BasicHelp text={record.printerCode} placement="top"></BasicHelp>
          </Space>
        );
      },
    },
    {
      title: '平台',
      dataIndex: 'platform',
      width: 100,
    },
    {
      title: '主机状态',
      dataIndex: 'clientOnline',
      width: 80,
      customRender: ({ text }) =>
        text ? <Tag color="success">在线</Tag> : <Tag color="error">离线</Tag>,
    },

    {
      title: '打印机显示名称',
      dataIndex: 'displayName',
      width: 260,
      resizable: true,
    },
    {
      title: '打印机状态',
      dataIndex: 'printerOnline',
      width: 100,
      customRender: ({ text }) =>
        text ? <Tag color="success">在线</Tag> : <Tag color="error">离线</Tag>,
    },
    {
      title: '排序',
      dataIndex: 'sortNum',
      width: 60,
      sorter: true,
    },
    {
      title: '备注',
      dataIndex: 'note',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 80,
      customRender: ({ record }) => (
        <StatusSwitch
          api={(checked) => modifyPrinterStatus([record.id], checked)}
          v-model:checked={record.enabled}
          auth="printer_enabled"
        />
      ),
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    autoSubmitOnEnter: true,
    submitOnChange: true,
    rowProps: {
      gutter: 16,
    },
    // showAdvancedButton: false,
    schemas: [
      {
        label: '打印机编号',
        field: `printerCode`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '打印机名称',
        field: `name`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '状态',
        field: `enabled`,
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

export const modalTitle = '打印机';
export type ActionKey = 'create' | 'edit';
export const createApi = createPrinter;
export const updateApi = updatePrinter;

export const getFormSchema: (actionKey?: ActionKey) => FormSchema[] = (actionKey) => {
  if (!actionKey) return [];
  return [
    {
      label: '打印机',
      field: 'printer',
      fields: ['printerCode', 'originName'],
      component: 'ApiSelect',
      componentProps: ({ formModel }) => ({
        placeholder: '打印机',
        api: getAllPrinter,
        valueField: 'id',
        formatter: (item) => item.name + `(${item.clientName}))`,
        onSelect: (_, option) => {
          formModel.printerCode = option?.clientId;
          formModel.name = option?.displayName;
          formModel.originName = option?.name;
        },
      }),
      dynamicRules: () => [{ required: true, message: '请选择打印机' }],
      colProps: { span: 24 },
    },
    {
      label: '名称',
      field: `name`,
      component: 'Input',
      required: true,
      colProps: { span: 24 },
      dynamicRules: () => [{ required: true, message: '请输入名字' }],
    },
    {
      field: `sortNum`,
      label: '排序',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
        controls: false,
        style: { width: '100%' },
      },
      defaultValue: 0,
      colProps: { span: 24 },
    },
    {
      field: `enabled`,
      label: '启用/禁用',
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
      label: '备注',
      field: 'note',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '请输入备注',
        autoSize: { minRows: 3 },
      },
      colProps: { span: 24 },
    },
  ];
};
