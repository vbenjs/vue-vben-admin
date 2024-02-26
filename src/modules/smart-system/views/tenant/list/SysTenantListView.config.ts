import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';
import type { FormSchema } from '@/components/Form';

export enum Permission {
  query = 'sys:tenant:query',
  save = 'sys:tenant:save',
  update = 'sys:tenant:update',
  delete = 'sys:tenant:delete',
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
      field: 'checkbox',
      fixed: 'left',
    },
    {
      field: 'tenantCode',
      fixed: 'left',
      title: '{system.views.tenant.title.tenantCode}',
      width: 180,
    },
    {
      field: 'tenantName',
      fixed: 'left',
      title: '{system.views.tenant.title.tenantName}',
      width: 180,
    },
    {
      field: 'contacts',
      title: '{system.views.tenant.title.contacts}',
      width: 120,
    },
    {
      field: 'contactPhone',
      title: '{system.views.tenant.title.contactPhone}',
      width: 120,
    },
    {
      field: 'domain',
      title: '{system.views.tenant.title.domain}',
      width: 160,
    },
    {
      field: 'availableUserNum',
      title: '{system.views.tenant.title.availableUserNum}',
      width: 160,
      sortable: true,
    },
    {
      field: 'address',
      title: '{system.views.tenant.title.address}',
      width: 120,
    },
    {
      field: 'logoId',
      visible: false,
      title: '{system.views.tenant.title.logoId}',
      width: 120,
    },
    {
      field: 'startTime',
      title: '{system.views.tenant.title.startTime}',
      width: 160,
      sortable: true,
    },
    {
      field: 'endTime',
      title: '{system.views.tenant.title.endTime}',
      width: 160,
      sortable: true,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 120,
    },
    {
      field: 'seq',
      title: '{common.table.seq}',
      width: 120,
      sortable: true,
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
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
    {
      field: 'useYn',
      title: '{common.table.useYn}',
      component: 'booleanTag',
      sortable: true,
      width: 120,
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
      label: t('system.views.tenant.title.id'),
      component: 'Input',
      show: false,
      componentProps: {},
    },
    {
      field: 'tenantCode',
      label: t('system.views.tenant.title.tenantCode'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'tenantName',
      label: t('system.views.tenant.title.tenantName'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'contacts',
      label: t('system.views.tenant.title.contacts'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'contactPhone',
      label: t('system.views.tenant.title.contactPhone'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'domain',
      label: t('system.views.tenant.title.domain'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'availableUserNum',
      label: t('system.views.tenant.title.availableUserNum'),
      component: 'InputNumber',
      componentProps: {},
    },
    {
      field: 'address',
      label: t('system.views.tenant.title.address'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'logoId',
      label: t('system.views.tenant.title.logoId'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'validatedTime',
      component: 'RangePicker',
      label: t('system.views.tenant.title.validatedTime'),
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
      defaultValue: 1,
      required: true,
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
      field: 'tenantCode',
      label: t('system.views.tenant.title.tenantCode'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      field: 'tenantName',
      label: t('system.views.tenant.title.tenantName'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      field: 'useYn',
      label: t('common.table.useYn'),
      component: 'Select',
      defaultValue: 1,
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
