import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridColumns } from '#/adapter/vxe-table';
import type { SystemDictApi } from '#/api';

import { z } from '#/adapter/form';
import { isDictCodeExists } from '#/api';
import { $t } from '#/locales';

const COLOR_OPTIONS = [
  { label: 'success', value: 'success' },
  { label: 'processing', value: 'processing' },
  { label: 'warning', value: 'warning' },
  { label: 'error', value: 'error' },
  { label: 'default', value: 'default' },
];

function getStatusOptions() {
  return [
    { label: $t('common.enabled'), value: 1 },
    { label: $t('common.disabled'), value: 0 },
  ];
}

/**
 * 获取字典类型搜索表单的字段配置
 */
export function useTypeGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.dict.dictName'),
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: $t('system.dict.code'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getStatusOptions(),
      },
      fieldName: 'status',
      label: $t('system.dict.status'),
    },
  ];
}

/**
 * 获取字典类型编辑表单的字段配置
 * @param getId 获取当前编辑的字典类型 ID，用于编码唯一性校验时排除自身
 */
export function useTypeFormSchema(
  getId: () => SystemDictApi.SystemDictType['id'] | undefined,
): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.dict.dictName'),
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', [$t('system.dict.dictName'), 2]))
        .max(
          50,
          $t('ui.formRules.maxLength', [$t('system.dict.dictName'), 50]),
        ),
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: $t('system.dict.code'),
      rules: z
        .string()
        .regex(/^[a-z][a-z0-9_]*$/, $t('system.dict.codeFormat'))
        .min(2, $t('ui.formRules.minLength', [$t('system.dict.code'), 2]))
        .max(50, $t('ui.formRules.maxLength', [$t('system.dict.code'), 50]))
        .refine(
          async (value: string) => {
            return !(await isDictCodeExists(value, getId()));
          },
          {
            error: (issue) =>
              $t('ui.formRules.alreadyExists', [
                $t('system.dict.code'),
                issue.input,
              ]),
          },
        ),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: getStatusOptions(),
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'status',
      label: $t('system.dict.status'),
    },
    {
      component: 'Textarea',
      componentProps: {
        maxLength: 100,
        rows: 3,
        showCount: true,
      },
      fieldName: 'remark',
      label: $t('system.dict.remark'),
      rules: z
        .string()
        .max(100, $t('ui.formRules.maxLength', [$t('system.dict.remark'), 100]))
        .optional(),
    },
  ];
}

/**
 * 获取字典类型表格列配置
 * @param onActionClick 表格操作按钮点击事件
 */
export function useTypeColumns(
  onActionClick: OnActionClickFn<SystemDictApi.SystemDictType>,
): VxeTableGridColumns<SystemDictApi.SystemDictType> {
  return [
    {
      field: 'name',
      minWidth: 140,
      title: $t('system.dict.dictName'),
    },
    {
      field: 'code',
      minWidth: 160,
      slots: { default: 'code' },
      title: $t('system.dict.code'),
    },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: $t('system.dict.status'),
      width: 100,
    },
    {
      field: 'remark',
      minWidth: 120,
      title: $t('system.dict.remark'),
    },
    {
      field: 'createTime',
      title: $t('system.dict.createTime'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.dict.dictName'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'data',
            text: $t('system.dict.data'),
          },
          'edit',
          'delete',
        ],
      },
      field: 'operation',
      fixed: 'right',
      showOverflow: false,
      title: $t('system.dict.operation'),
      width: 220,
    },
  ];
}

/**
 * 获取字典数据搜索表单的字段配置
 */
export function useDataGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'label',
      label: $t('system.dict.label'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getStatusOptions(),
      },
      fieldName: 'status',
      label: $t('system.dict.status'),
    },
  ];
}

/**
 * 获取字典数据编辑表单的字段配置
 */
export function useDataFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      fieldName: 'dictCode',
      label: $t('system.dict.code'),
    },
    {
      component: 'Input',
      fieldName: 'label',
      label: $t('system.dict.label'),
      rules: z
        .string()
        .min(1, $t('ui.formRules.required', [$t('system.dict.label')]))
        .max(50, $t('ui.formRules.maxLength', [$t('system.dict.label'), 50])),
    },
    {
      component: 'Input',
      fieldName: 'value',
      label: $t('system.dict.value'),
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        class: 'w-full',
        options: COLOR_OPTIONS,
      },
      fieldName: 'color',
      label: $t('system.dict.color'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        class: 'w-full',
        min: 0,
      },
      defaultValue: 0,
      fieldName: 'sort',
      label: $t('system.dict.sort'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: getStatusOptions(),
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'status',
      label: $t('system.dict.status'),
    },
    {
      component: 'Textarea',
      componentProps: {
        maxLength: 100,
        rows: 3,
        showCount: true,
      },
      fieldName: 'remark',
      label: $t('system.dict.remark'),
      rules: z
        .string()
        .max(100, $t('ui.formRules.maxLength', [$t('system.dict.remark'), 100]))
        .optional(),
    },
  ];
}

/**
 * 获取字典数据表格列配置
 * @param onActionClick 表格操作按钮点击事件
 */
export function useDataColumns(
  onActionClick: OnActionClickFn<SystemDictApi.SystemDictData>,
): VxeTableGridColumns<SystemDictApi.SystemDictData> {
  return [
    {
      field: 'label',
      minWidth: 120,
      slots: { default: 'label' },
      title: $t('system.dict.label'),
    },
    {
      field: 'value',
      minWidth: 100,
      title: $t('system.dict.value'),
    },
    {
      field: 'color',
      minWidth: 100,
      title: $t('system.dict.color'),
    },
    {
      field: 'sort',
      title: $t('system.dict.sort'),
      width: 80,
    },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: $t('system.dict.status'),
      width: 100,
    },
    {
      field: 'remark',
      minWidth: 120,
      title: $t('system.dict.remark'),
    },
    {
      field: 'createTime',
      title: $t('system.dict.createTime'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'label',
          nameTitle: $t('system.dict.label'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: ['edit', 'delete'],
      },
      field: 'operation',
      fixed: 'right',
      showOverflow: false,
      title: $t('system.dict.operation'),
      width: 150,
    },
  ];
}
