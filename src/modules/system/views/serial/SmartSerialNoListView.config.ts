import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';
import type { FormSchema } from '@/components/Form';
import { tableUseYnClass } from '@/components/SmartTable';

/**
 * 表格列表
 */
export const getTableColumns = (): SmartColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'seq',
      title: '{common.table.seq}',
      fixed: 'left',
      width: 120,
      sortable: true,
    },
    {
      field: 'code',
      title: '{smart.tools.serial.title.code}',
      fixed: 'left',
      width: 120,
    },
    {
      field: 'name',
      fixed: 'left',
      title: '{smart.tools.serial.title.name}',
      width: 120,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 120,
    },
    {
      field: 'serialFormat',
      title: '{smart.tools.serial.title.serialFormat}',
      width: 180,
    },
    {
      field: 'prefix',
      title: '{smart.tools.serial.title.prefix}',
      width: 120,
    },
    {
      field: 'dateFormat',
      title: '{smart.tools.serial.title.dateFormat}',
      width: 200,
    },
    {
      field: 'serialLength',
      title: '{smart.tools.serial.title.serialLength}',
      width: 120,
    },
    {
      field: 'minValue',
      title: '{smart.tools.serial.title.minValue}',
      width: 120,
    },
    {
      field: 'maxValue',
      title: '{smart.tools.serial.title.maxValue}',
      width: 120,
    },
    {
      field: 'stepValue',
      title: '{smart.tools.serial.title.stepValue}',
      width: 120,
    },
    {
      field: 'currentDate',
      title: '{smart.tools.serial.title.currentDate}',
      width: 120,
    },
    {
      field: 'currentValue',
      title: '{smart.tools.serial.title.currentValue}',
      width: 120,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 160,
      sortable: true,
    },
    {
      field: 'createBy',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'updateTime',
      title: '{common.table.updateTime}',
      width: 160,
      sortable: true,
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
    {
      ...tableUseYnClass(),
    },
    {
      title: '{common.table.operation}',
      field: 'operation',
      width: 120,
      fixed: 'right',
      slots: {
        default: 'table-operation',
      },
    },
  ];
};

/**
 * 添加修改表单
 */
export const getFormSchemas = (t: Function): FormSchema[] => {
  return [
    {
      field: 'id',
      label: '',
      component: 'Input',
      show: false,
      componentProps: {},
    },
    {
      field: 'code',
      label: t('smart.tools.serial.title.code'),
      component: 'Input',
      required: true,
      componentProps: {},
    },
    {
      field: 'name',
      label: t('smart.tools.serial.title.name'),
      component: 'Input',
      required: true,
      componentProps: {},
    },
    {
      field: 'remark',
      label: t('common.table.remark'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'seq',
      label: t('common.table.seq'),
      component: 'InputNumber',
      required: true,
      defaultValue: 1,
      componentProps: {},
    },
    {
      field: 'serialFormat',
      label: t('smart.tools.serial.title.serialFormat'),
      component: 'Input',
      required: true,
      defaultValue: '{PREFIX}{DATE}{NUMBER}',
      componentProps: {},
    },
    {
      field: 'prefix',
      label: t('smart.tools.serial.title.prefix'),
      component: 'Input',
      required: true,
      componentProps: {},
    },
    {
      field: 'dateFormat',
      label: t('smart.tools.serial.title.dateFormat'),
      component: 'Input',
      required: true,
      componentProps: {},
    },
    {
      field: 'serialLength',
      label: t('smart.tools.serial.title.serialLength'),
      component: 'Input',
      required: true,
      componentProps: {},
    },
    {
      field: 'minValue',
      label: t('smart.tools.serial.title.minValue'),
      component: 'InputNumber',
      required: true,
      defaultValue: 1,
      componentProps: {},
    },
    {
      field: 'maxValue',
      label: t('smart.tools.serial.title.maxValue'),
      component: 'InputNumber',
      required: true,
      defaultValue: -1,
      componentProps: {},
    },
    {
      field: 'stepValue',
      label: t('smart.tools.serial.title.stepValue'),
      component: 'InputNumber',
      required: true,
      defaultValue: 1,
      componentProps: {},
    },
    {
      field: 'currentDate',
      label: t('smart.tools.serial.title.currentDate'),
      component: 'DatePicker',
      defaultValue: new Date(),
      componentProps: {
        disabled: true,
        style: {
          width: '100%',
        },
      },
    },
    {
      field: 'currentValue',
      label: t('smart.tools.serial.title.currentValue'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      field: 'useYn',
      label: t('common.table.useYn'),
      component: 'Switch',
      required: true,
      defaultValue: true,
      componentProps: {},
    },
  ];
};

export const getSearchFormSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      field: 'code',
      label: t('smart.tools.serial.title.code'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      field: 'name',
      label: t('smart.tools.serial.title.name'),
      component: 'Input',
      searchSymbol: '=',
    },
  ];
};
