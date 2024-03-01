import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';
import type { FormSchema } from '@/components/Form';

export enum Permissions {
  query = 'sys:parameter:query',
  save = 'sys:parameter:save',
  update = 'sys:parameter:update',
  delete = 'sys:parameter:delete',
  updateBuildIn = 'sys:parameter:updateBuildIn',
}

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
      field: 'code',
      fixed: 'left',
      title: '{system.views.parameter.title.code}',
      width: 160,
    },
    {
      field: 'name',
      fixed: 'left',
      title: '{system.views.parameter.title.name}',
      width: 160,
    },
    {
      field: 'parameter',
      title: '{system.views.parameter.title.parameter}',
      minWidth: 200,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 200,
    },
    {
      field: 'buildIn',
      sortable: true,
      title: '{system.views.parameter.title.buildIn}',
      width: 120,
      component: 'booleanTag',
    },
    {
      field: 'seq',
      sortable: true,
      title: '{common.table.seq}',
      width: 120,
    },
    {
      field: 'createTime',
      sortable: true,
      title: '{common.table.createTime}',
      width: 160,
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
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
    {
      field: 'useYn',
      sortable: true,
      title: '{common.table.useYn}',
      component: 'booleanTag',
      width: 120,
    },
    {
      field: 'operation',
      title: '{common.table.operation}',
      width: 120,
      slots: {
        default: 'table-operation',
      },
      fixed: 'right',
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
      show: false,
      label: t('system.views.parameter.title.id'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'code',
      label: t('system.views.parameter.title.code'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'name',
      label: t('system.views.parameter.title.name'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'parameter',
      label: t('system.views.parameter.title.parameter'),
      component: 'InputTextArea',
      componentProps: {},
      required: true,
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
      componentProps: {},
      required: true,
      defaultValue: 1,
    },
    {
      field: 'useYn',
      label: t('common.table.useYn'),
      component: 'Switch',
      componentProps: {},
      defaultValue: true,
    },
  ];
};

export const getSearchFormSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      field: 'code',
      label: t('system.views.parameter.title.code'),
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {
        style: { width: '150px' },
      },
    },
    {
      field: 'name',
      label: t('system.views.parameter.title.name'),
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {
        style: { width: '150px' },
      },
    },
    {
      field: 'buildIn',
      label: t('system.views.parameter.title.buildIn'),
      component: 'Select',
      componentProps: {
        style: { width: '120px' },
        options: [
          {
            label: 'Y',
            value: 1,
          },
          {
            label: 'N',
            value: 0,
          },
        ],
      },
      searchSymbol: '=',
    },
    {
      field: 'useYn',
      label: t('common.table.useYn'),
      component: 'Select',
      componentProps: {
        style: { width: '120px' },
        options: [
          {
            label: 'Y',
            value: 1,
          },
          {
            label: 'N',
            value: 0,
          },
        ],
      },
      searchSymbol: '=',
    },
  ];
};
