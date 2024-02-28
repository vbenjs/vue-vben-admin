import { BasicColumn, FormProps, FormSchema } from '@/components/Table';
import { HxPda } from '@/ApiModel/configuration/pda';
import { createPda, modifyPdaStatus, updatePda } from '@/api/configuration/pda';
import { StatusSwitch } from '@/components/Business';
import { YNTag } from '@/components/Tag';

export type TableResult = HxPda;

export function getColumns(): BasicColumn<TableResult>[] {
  return [
    { title: '名称', dataIndex: 'name', width: 120 },
    {
      title: '编码',
      dataIndex: 'code',
      width: 120,
    },
    // {
    //   title: '不完整入库',
    //   dataIndex: 'shortageStore',
    //   width: 120,
    //   customRender: ({ text }) => <YNTag text={text} />,
    // },
    // {
    //   title: '修改配置',
    //   dataIndex: 'modifyLock',
    //   width: 100,
    //   customRender: ({ text }) => <YNTag text={text} />,
    // },
    {
      title: '箱配置',
      dataIndex: 'boxConfig',
      children: [
        {
          title: '默认盒数',
          dataIndex: 'packageCount',
          width: 100,
        },
        // {
        //   title: '允许混装',
        //   dataIndex: 'mixBox',
        //   width: 100,
        //   customRender: ({ text }) => <YNTag text={text} />,
        // },
        {
          title: '允许不足',
          dataIndex: 'shortageBox',
          width: 100,
          customRender: ({ text }) => <YNTag text={text} />,
        },
      ],
    },
    {
      title: '托配置',
      dataIndex: 'palletConfig',
      children: [
        {
          title: '默认箱数',
          dataIndex: 'boxCount',
          width: 100,
        },
        // {
        //   title: '允许混装',
        //   dataIndex: 'mixPallet',
        //   width: 100,
        //   customRender: ({ text }) => <YNTag text={text} />,
        // },
        {
          title: '允许不足',
          dataIndex: 'shortagePallet',
          width: 100,
          customRender: ({ text }) => <YNTag text={text} />,
        },
      ],
    },
    {
      title: '备注',
      dataIndex: 'note',
      width: 220,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 80,
      customRender: ({ record }) => (
        <StatusSwitch
          api={(checked) => modifyPdaStatus([record.id], checked)}
          v-model:checked={record.enabled}
          auth="pda_enabled"
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
        label: '编码',
        field: `code`,
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

export const modalTitle = 'PDA';
export type ActionKey = 'create' | 'edit';
export const createApi = createPda;
export const updateApi = updatePda;

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
      colProps: { span: 12 },
    },
    {
      label: '编码',
      field: 'code',
      component: 'Input',
      componentProps: {
        placeholder: '编码',
      },
      rules: [{ required: true, message: '请输入编码' }],
      colProps: { span: 12 },
    },
    // {
    //   label: '箱相关',
    //   field: 'divider',
    //   component: 'Divider',
    //   componentProps: {
    //     // style: 'margin-top: 0px;margin-bottom: 10px;',
    //   },
    //   colProps: { span: 24 },
    // },
    {
      field: 'divider',
      component: 'BasicTitle',
      label: '箱相关',
      componentProps: {
        line: true,
        span: true,
      },
      colProps: { span: 24 },
    },
    {
      label: '默认盒数',
      field: 'packageCount',
      required: true,
      component: 'InputNumber',
      componentProps: {
        style: 'width:100%',
        controls: false,
        min: 0,
        precision: 0,
      },
      colProps: { span: 18 },
    },
    // {
    //   // label: '允许混装',
    //   field: 'mixBox',
    //   component: 'Checkbox',
    //   renderComponentContent: '允许混装',
    //   defaultValue: false,
    //   colProps: { span: 6 },
    // },
    {
      label: '',
      field: 'shortageBox',
      component: 'Checkbox',
      renderComponentContent: '允许不足',
      defaultValue: false,
      colProps: { span: 6 },
    },
    {
      label: '托相关',
      field: 'divider',
      component: 'BasicTitle',
      componentProps: {
        line: true,
        span: true,
      },
      colProps: { span: 24 },
    },
    {
      label: '默认箱数',
      field: 'boxCount',
      required: true,
      component: 'InputNumber',
      componentProps: {
        style: 'width:100%',
        controls: false,
        min: 0,
        precision: 0,
      },
      colProps: { span: 18 },
    },
    // {
    //   // label: '允许混装',
    //   field: 'mixPallet',
    //   component: 'Checkbox',
    //   renderComponentContent: '允许混装',
    //   defaultValue: false,
    //   colProps: { span: 6 },
    // },
    {
      // label: '允许不足',
      field: 'shortagePallet',
      component: 'Checkbox',
      renderComponentContent: '允许不足',
      defaultValue: false,
      colProps: { span: 6 },
    },
    {
      label: '其他',
      field: 'divider',
      component: 'BasicTitle',
      componentProps: {
        line: true,
        span: true,
      },
      colProps: { span: 24 },
    },
    // {
    //   // label: '不完整入库',
    //   field: 'shortageStore',
    //   component: 'Checkbox',
    //   renderComponentContent: '允许不完整入库',
    //   defaultValue: false,
    //   colProps: { span: 8 },
    // },
    // {
    //   // label: '修改配置',
    //   field: 'modifyLock',
    //   component: 'Checkbox',
    //   renderComponentContent: '允许PDA修改配置',
    //   defaultValue: false,
    //   colProps: { span: 10 },
    // },
    {
      label: '启用/禁用',
      field: 'enabled',
      component: 'Switch',
      defaultValue: true,
      colProps: { span: 6 },
    },
    {
      label: '排序',
      field: 'sortNum',
      component: 'InputNumber',
      componentProps: {
        style: 'width:100%',
        controls: false,
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
        autoSize: { minRows: 3 },
      },
      colProps: { span: 24 },
    },
  ];
};
