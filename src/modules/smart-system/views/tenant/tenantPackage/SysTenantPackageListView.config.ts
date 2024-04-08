import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';
import type { FormSchema } from '@/components/Form';
import { getUseYnSelectOptions } from '@/utils/form';
import { tableUseYnClass } from '@/components/SmartTable';

export enum Permission {
  save = 'sys:tenant:package:save',
  delete = 'sys:tenant:package:delete',
  update = 'sys:tenant:package:update',
  setUseYn = 'sys:tenant:package:setUseYn',
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
      field: 'checkbox',
    },
    {
      field: 'packageCode',
      sortable: true,
      title: '{system.views.tenant.package.title.packageCode}',
      width: 120,
    },
    {
      field: 'packageName',
      title: '{system.views.tenant.package.title.packageName}',
      width: 120,
    },
    {
      field: 'effectTime',
      sortable: true,
      title: '{system.views.tenant.package.title.effectTime}',
      width: 165,
    },
    {
      field: 'expireTime',
      sortable: true,
      title: '{system.views.tenant.package.title.expireTime}',
      width: 165,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      minWidth: 120,
    },
    {
      field: 'seq',
      sortable: true,
      title: '{common.table.seq}',
      width: 120,
    },
    {
      ...tableUseYnClass(),
      field: 'useYn',
      sortable: true,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 165,
    },
    {
      field: 'createBy',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'updateTime',
      title: '{common.table.updateTime}',
      width: 165,
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
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
      label: t('system.views.tenant.package.title.id'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'packageCode',
      label: t('system.views.tenant.package.title.packageCode'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'packageName',
      label: t('system.views.tenant.package.title.packageName'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'times',
      label: t('system.views.tenant.package.title.effectTime'),
      component: 'RangePicker',
      componentProps: {
        showTime: true,
      },
      required: true,
    },
    {
      field: 'seq',
      label: t('common.table.seq'),
      component: 'InputNumber',
      componentProps: {},
      defaultValue: 1,
    },
    {
      field: 'remark',
      label: t('common.table.remark'),
      component: 'InputTextArea',
      componentProps: {},
    },
  ];
};

export const getSearchFormSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      field: 'packageCode',
      label: t('system.views.tenant.package.title.packageCode'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      field: 'packageName',
      label: t('system.views.tenant.package.title.packageName'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      field: 'times',
      label: t('system.views.tenant.package.title.effectTime'),
      component: 'RangePicker',
      componentProps: {
        showTime: true,
        style: { width: '320px' },
      },
    },
    {
      field: 'useYn',
      label: t('common.table.useYn'),
      component: 'Select',
      componentProps: {
        options: getUseYnSelectOptions(),
        style: { width: '100px' },
      },
      searchSymbol: '=',
      defaultValue: 1,
    },
  ];
};
