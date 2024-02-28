import { HxPrintTemplate } from '@/ApiModel/configuration/printTemplate';
import {
  createPrintTemplate,
  getAllPrintTemplateType,
  modifyPrintTemplateStatus,
  updatePrintTemplate,
} from '@/api/configuration/printTemplate';
import { StatusSwitch } from '@/components/Business';
import { FormProps, FormSchema } from '@/components/Form';
import { BasicColumn } from '@/components/Table';
import { YNTag } from '@/components/Tag';
import { useOptionStore } from '@/store/modules/options';
import { sortFn } from '@/utils/util';
import { ComputedRef, computed } from 'vue';

const optionStore = useOptionStore();

export type TableResult = HxPrintTemplate;

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
): ComputedRef<BasicColumn<TableResult>[]> {
  const { sorter, canEnable, showEnable } = options;
  return computed(() => {
    return [
      { title: '名称', dataIndex: 'name', width: 120 },
      {
        title: '类型',
        dataIndex: 'templateType',
        width: 120,
        customRender: ({ text }) => optionStore.getOptionName(text, 'templateType'),
      },
      {
        title: '排序',
        dataIndex: 'sortNum',
        width: 60,
        sorter: sortFn('sortNum', sorter),
      },
      {
        title: '备注',
        dataIndex: 'note',
      },
      {
        title: '状态',
        dataIndex: 'enabled',
        width: 80,
        customRender: ({ record, text }) =>
          canEnable ? (
            <StatusSwitch
              api={(checked) => modifyPrintTemplateStatus([record.id], checked)}
              v-model:checked={record.enabled}
              auth="printTemplate_enabled"
            />
          ) : (
            <YNTag text={text} trueLabel="启用" falseLabel="禁用" />
          ),
        ifShow: showEnable,
      },
    ];
  });
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
        label: '模板名称',
        field: `name`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '模板类型',
        field: `templateType`,
        component: 'ApiSelect',
        componentProps: {
          api: optionStore.initPrintTemplateType,
          labelField: 'name',
          valueField: 'code',
          mode: 'multiple',
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

export const modalTitle = '打印模板';
export type ActionKey = 'create' | 'edit';
export const createApi = createPrintTemplate;
export const updateApi = updatePrintTemplate;
export const getFormSchema: (actionKey?: ActionKey) => FormSchema[] = (actionKey) => {
  if (!actionKey) return [];
  return [
    {
      label: '名称',
      field: `name`,
      component: 'Input',
      required: true,
      colProps: { span: 24 },
    },
    {
      label: '模板类型',
      field: `templateType`,
      component: 'ApiSelect',
      componentProps: {
        api: getAllPrintTemplateType,
        labelField: 'name',
        valueField: 'code',
      },
      required: true,
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
      field: `note`,
      component: 'InputTextArea',
      componentProps: {
        autoSize: { minRows: 4 },
      },
      colProps: { span: 24 },
    },
  ];
};
