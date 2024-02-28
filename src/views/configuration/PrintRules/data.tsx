import { BasicColumn, FormProps, FormSchema } from '@/components/Table';

import { StatusSwitch } from '@/components/Business';
import { printRuleTypeMap, printRuleTypeOptions } from '@/enums/printRuleType';
import { Form, Space } from 'ant-design-vue';
import { ApiSelect } from '@/components/Form';
// import { templateTypeOptions } from '@/enums/templateType';
import { YNTag } from '@/components/Tag';
import { getAccount } from '@/api/system/account';
import { getCustomer } from '@/api/configuration/customer';
import { getBarcodeRule } from '@/api/configuration/barcodeRule';
import { getAllPrintTemplateType, getPrintTemplate } from '@/api/configuration/printTemplate';
import { getPrinter } from '@/api/configuration/printer';
import { getPda } from '@/api/configuration/pda';
import {
  createPrintRule,
  modifyPrintRuleStatus,
  updatePrintRule,
} from '@/api/configuration/printRule';

import { HxPrintRule } from '@/ApiModel/configuration/printRule';
import { HxCustomer } from '@/ApiModel/configuration/customer';
import { HxPrintTemplate } from '@/ApiModel/configuration/printTemplate';
import { HxPrinter } from '@/ApiModel/configuration/printer';
import { HxBarcodeRule } from '@/ApiModel/configuration/barcodeRule';
import { HxPda } from '@/ApiModel/configuration/pda';
import { Account } from '@/ApiModel/system/accountModel';

export type TableResult = HxPrintRule;
export function getColumns(): BasicColumn<TableResult>[] {
  return [
    { title: '名称', dataIndex: 'name', width: 120 },
    {
      title: '客户',
      dataIndex: ['customer', 'name'],
      width: 120,
    },
    {
      title: '类型',
      dataIndex: 'refType',
      width: 120,
      customRender: ({ text }) => {
        return printRuleTypeMap.get(text);
      },
    },
    {
      title: 'PDA或用户',
      dataIndex: 'pda',
      width: 120,
      customRender: ({ record }) => {
        return record.pda?.name ?? record.account?.name ?? record.account?.username;
      },
    },
    {
      title: '打印机',
      dataIndex: ['printer', 'name'],
      width: 120,
    },
    {
      title: '打印模板',
      dataIndex: ['template', 'name'],
      width: 120,
    },
    {
      title: '生成规则',
      dataIndex: ['barcodeRule', 'name'],
      width: 120,
    },
    {
      title: '默认规则',
      dataIndex: 'defaultRule',
      width: 80,
      customRender: ({ text }) => <YNTag text={text} />,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 80,
      customRender: ({ record }) => (
        <StatusSwitch
          api={(checked) => modifyPrintRuleStatus([record.id], checked)}
          v-model:checked={record.enabled}
          auth="printRule_enabled"
        />
      ),
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
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    autoSubmitOnEnter: true,
    submitOnChange: true,
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
      {
        label: '模板类型',
        field: `templateType`,
        component: 'ApiSelect',
        componentProps: {
          api: getAllPrintTemplateType,
          labelField: 'name',
          valueField: 'code',
          mode: 'multiple',
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '类型',
        field: 'refType',
        component: 'Select',
        componentProps: () => ({
          options: printRuleTypeOptions,
        }),
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '用户或PDA',
        field: 'refInfo',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ],
  };
}

export const modalTitle = '打印规则';
export type ActionKey = 'create' | 'edit';
export const createApi = createPrintRule;
export const updateApi = updatePrintRule;

interface Props {
  customer?: HxCustomer;
  template?: HxPrintTemplate;
  printer?: HxPrinter;
  barcodeRule?: HxBarcodeRule;
  pda?: HxPda;
  account?: Account;
}

export function getFormSchema(data: Props = {}): FormSchema[] {
  return [
    {
      label: '名称',
      field: 'name',
      component: 'Input',
      componentProps: {
        placeholder: '名称',
      },
      rules: [{ required: true, message: '请输入名称' }],
      colProps: { span: 24 },
    },
    {
      label: '客户',
      field: 'customerId',
      component: 'ApiSelect',
      componentProps: () => ({
        placeholder: '客户',
        api: getCustomer,
        immediate: false,
        showSearch: true,
        labelField: 'name',
        valueField: 'id',
        searchField: 'name',
        checkedOptions: data.customer,
      }),
      dynamicRules: () => {
        return [{ required: true, message: '请选择客户', trigger: 'blur' }];
      },
      colProps: { span: 24 },
    },
    {
      label: '类型',
      field: 'refType',
      component: 'RadioButtonGroup',
      componentProps: ({ formModel }) => ({
        options: printRuleTypeOptions,
        onChange: () => {
          formModel.refId = undefined;
        },
      }),
      defaultValue: 'PDA',
      colProps: { span: 24 },
    },
    {
      label: 'PDA',
      field: 'refId',
      component: 'ApiSelect',
      componentProps: () => ({
        placeholder: 'PDA',
        api: getPda,
        immediate: false,
        showSearch: true,
        labelField: 'name',
        valueField: 'id',
        searchField: 'name',
        checkedOptions: data.pda,
      }),
      colProps: { span: 24 },
      dynamicRules: () => [{ required: true, message: '请选择PDA', trigger: 'blur' }],
      ifShow: ({ model }) => {
        return model.refType === 'PDA';
      },
    },
    {
      label: '用户',
      field: 'refId',
      component: 'ApiSelect',
      componentProps: () => ({
        placeholder: '用户',
        api: getAccount,
        immediate: false,
        showSearch: true,
        labelField: 'name',
        valueField: 'id',
        searchField: 'name',
        checkedOptions: data.account,
      }),
      dynamicRules: () => [{ required: true, message: '请选择用户' }],
      colProps: { span: 24 },
      ifShow: ({ model }) => {
        return model.refType === 'USER';
      },
    },
    {
      label: '片数',
      field: `pieceCount`,
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
        controls: false,
        style: { width: '100%' },
      },
      required: true,
      colProps: { span: 18 },
    },
    {
      field: 'pieceModify',
      component: 'Checkbox',
      renderComponentContent: '允许修改',
      defaultValue: true,
      colProps: { span: 6 },
    },
    {
      label: '序列号长度',
      field: `serialLen`,
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
        controls: false,
        style: { width: '100%' },
      },
      required: true,
      defaultValue: 4,
      colProps: { span: 18 },
    },
    {
      field: 'serialModify',
      component: 'Checkbox',
      renderComponentContent: '允许修改',
      defaultValue: true,
      colProps: { span: 6 },
    },
    {
      label: '打印机',
      field: 'printerId',
      component: 'ApiSelect',
      componentProps: () => ({
        placeholder: '打印机',
        api: getPrinter,
        immediate: false,
        showSearch: true,
        labelField: 'name',
        valueField: 'id',
        searchField: 'name',
        checkedOptions: data.printer,
      }),
      dynamicRules: () => [{ required: true, message: '请选择打印机' }],
      colProps: { span: 24 },
    },
    {
      label: '打印模板',
      field: 'templateType',
      fields: ['templateId'],
      component: 'ApiSelect',
      render: ({ model, field }) => {
        return (
          <Form.Item name="templateType">
            <Space.Compact class="w-full">
              <Form.ItemRest>
                <ApiSelect
                  style="flex:4"
                  api={getAllPrintTemplateType}
                  labelField="name"
                  valueField="code"
                  v-model:value={model[field]}
                  onSelect={() => {
                    model['templateId'] = undefined;
                    model['barcodeId'] = undefined;
                  }}
                ></ApiSelect>
              </Form.ItemRest>
              <ApiSelect
                style="flex:6"
                api={getPrintTemplate}
                params={{ templateType: [model[field]] }}
                v-model:value={model['templateId']}
                labelField="name"
                valueField="id"
                checkedOptions={data.template}
                allowClear
              ></ApiSelect>
            </Space.Compact>
          </Form.Item>
        );
      },
      dynamicRules: ({ model }) => {
        return [
          {
            required: true,
            validator: async () => {
              if (!model.templateType) return Promise.reject('请选择打印模板类型');
              // if (!model.templateId) return Promise.reject('请选择打印模板');
              Promise.resolve();
            },
            trigger: ['change', 'blur'],
          },
        ];
      },
      colProps: { span: 24 },
    },
    {
      label: '生成规则',
      field: 'barcodeId',
      component: 'ApiSelect',
      dynamicDisabled({ model }) {
        return !['PACKAGE', 'BOX', 'PALLET'].includes(model.templateType);
      },
      required({ model }) {
        return ['PACKAGE', 'BOX', 'PALLET'].includes(model.templateType);
      },
      componentProps: ({ formModel }) => ({
        placeholder: '生成规则',
        api: async (where) => {
          if (!['PACKAGE', 'BOX', 'PALLET'].includes(formModel.templateType)) return [];
          const data = await getBarcodeRule(where);
          return data.filter((item) => item.ruleType === formModel.templateType);
        },
        immediate: false,
        showSearch: true,
        labelField: 'name',
        valueField: 'id',
        searchField: 'name',
        checkedOptions: data.barcodeRule,
      }),
      colProps: { span: 24 },
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
      label: '默认规则',
      field: 'defaultRule',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是', value: true },
          { label: '否', value: false },
        ],
      },
      defaultValue: 'Y',
      colProps: { span: 24 },
    },
    {
      label: '状态',
      field: 'enabled',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '启用', value: true },
          { label: '禁用', value: false },
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
}
