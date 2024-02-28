import { BasicColumn, FormProps, FormSchema } from '@/components/Table';
import { HxBarcodeRule } from '@/ApiModel/configuration/barcodeRule';
import {
  createBarcodeRule,
  getBindField,
  modifyBarcodeRuleStatus,
  updateBarcodeRule,
} from '@/api/configuration/barcodeRule';
import { barcodeRuleTypeMap, barcodeRuleTypeOptions } from '@/enums/barcodeRuleType';
import { StatusSwitch } from '@/components/Business';
import { sortFn } from '@/utils/util';
import { YNTag } from '@/components/Tag';

export type TableResult = HxBarcodeRule;
interface ColumnsOptions {
  sorter?: 'self' | boolean;
  canEnable?: boolean;
  showEnable?: boolean;
}

export function getColumns(
  options: ColumnsOptions = {
    sorter: true,
    canEnable: true,
    showEnable: true,
  },
): BasicColumn<TableResult>[] {
  const { sorter, canEnable, showEnable } = options;

  return [
    { title: '名称', dataIndex: 'name', width: 120 },
    {
      title: '类型',
      dataIndex: 'ruleType',
      width: 120,
      customRender: ({ text }) => barcodeRuleTypeMap.get(text),
    },
    {
      title: '绑定字段',
      dataIndex: 'bindField',
      width: 120,
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
      customRender: ({ record, text }) =>
        canEnable ? (
          <StatusSwitch
            api={(checked) => modifyBarcodeRuleStatus([record.id], checked)}
            v-model:checked={record.enabled}
            auth="barcodeRule_enabled"
          />
        ) : (
          <YNTag text={text} trueLabel="启用" falseLabel="禁用" />
        ),
      ifShow: showEnable,
    },
    {
      title: '排序',
      dataIndex: 'sortNum',
      width: 60,
      sorter: sortFn('sortNum', sorter),
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
        label: '类型',
        field: 'ruleType',
        component: 'Select',
        componentProps: {
          options: barcodeRuleTypeOptions,
          mode: 'multiple',
          showSearch: false,
        },
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

export const modalTitle = '条码生成规则';
export type ActionKey = 'create' | 'edit';
export const createApi = createBarcodeRule;
export const updateApi = updateBarcodeRule;

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
      colProps: { span: 24 },
    },
    {
      label: '类型',
      field: 'ruleType',
      component: 'Select',
      componentProps: {
        options: barcodeRuleTypeOptions,
      },
      dynamicRules: () => {
        return [{ required: true, message: '请选择类型', trigger: 'blur' }];
      },
      colProps: { span: 24 },
      ifShow: actionKey !== 'edit',
    },
    {
      label: '绑定字段',
      field: 'bindField',
      component: 'ApiSelect',
      componentProps: () => ({
        placeholder: '绑定字段',
        api: getBindField,
        immediate: true,
        showSearch: true,
        labelField: 'name',
        valueField: 'code',
      }),
      colProps: { span: 24 },
      ifShow: ({ values }) => values?.ruleType === 'OTHER',
    },
    // {
    //   label: '生成规则',
    //   field: 'content',
    //   component: 'InputTextArea',
    //   componentProps: {
    //     placeholder: '请输入规则',
    //     autoSize: { minRows: 4 },
    //   },
    //   colProps: { span: 24 },
    // },
    // {
    //   label: '生成规则',
    //   field: 'verify',
    //   component: 'InputTextArea',
    //   componentProps: {
    //     placeholder: '请输入规则',
    //     autoSize: { minRows: 4 },
    //   },
    //   colProps: { span: 24 },
    // },
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
};
