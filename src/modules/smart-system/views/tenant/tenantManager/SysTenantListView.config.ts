import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';
import type { FormSchema } from '@/components/Form';
import { tableUseYnClass } from '@/components/SmartTable';
import { Ref, unref } from 'vue';

export enum Permission {
  save = 'sys:tenant:manager:save',
  update = 'sys:tenant:manager:update',
  delete = 'sys:tenant:manager:delete',
  useYn = 'sys:tenant:manager:setUseYn',
}

export const SYSTEM_TENANT_TYPE_DICT = 'SYSTEM_TENANT_TYPE';
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
      field: 'tenantCode',
      title: '{system.views.tenant.manager.title.tenantCode}',
      width: 120,
      fixed: 'left',
    },
    {
      field: 'tenantName',
      title: '{system.views.tenant.manager.title.tenantName}',
      width: 120,
      fixed: 'left',
    },
    {
      field: 'tenantShortName',
      title: '{system.views.tenant.manager.title.tenantShortName}',
      width: 120,
    },
    {
      field: 'type',
      title: '{system.views.tenant.manager.title.type}',
      width: 120,
      sortable: true,
      slots: {
        default: 'table-type',
      },
    },
    {
      field: 'contacts',
      title: '{system.views.tenant.manager.title.contacts}',
      width: 120,
    },
    {
      field: 'contactPhone',
      title: '{system.views.tenant.manager.title.contactPhone}',
      width: 120,
    },
    {
      field: 'email',
      title: '{system.views.tenant.manager.title.email}',
      width: 120,
    },
    {
      field: 'isolationStrategy',
      title: '{system.views.tenant.manager.title.isolationStrategy}',
      width: 120,
      slots: {
        default: 'table-isolationStrategy',
      },
    },
    {
      field: 'industry',
      title: '{system.views.tenant.manager.title.industry}',
      width: 120,
    },
    {
      field: 'domain',
      title: '{system.views.tenant.manager.title.domain}',
      width: 120,
    },
    {
      field: 'availableUserNum',
      title: '{system.views.tenant.manager.title.availableUserNum}',
      width: 120,
    },
    {
      field: 'region',
      title: '{system.views.tenant.manager.title.region}',
      width: 120,
    },
    {
      field: 'address',
      title: '{system.views.tenant.manager.title.address}',
      width: 120,
    },
    {
      field: 'logoId',
      title: '{system.views.tenant.manager.title.logoId}',
      width: 120,
    },
    {
      field: 'effectTime',
      title: '{system.views.tenant.manager.title.effectTime}',
      width: 165,
      sortable: true,
    },
    {
      field: 'expireTime',
      title: '{system.views.tenant.manager.title.expireTime}',
      width: 165,
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
      ...tableUseYnClass(),
      sortable: true,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 165,
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
      width: 165,
      sortable: true,
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
export const getFormSchemas = (t: Function, isolationStrategyListRef: Ref): FormSchema[] => {
  return [
    {
      field: 'id',
      show: false,
      label: t('system.views.tenant.manager.title.id'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'tenantCode',
      label: t('system.views.tenant.manager.title.tenantCode'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'tenantName',
      label: t('system.views.tenant.manager.title.tenantName'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'tenantShortName',
      label: t('system.views.tenant.manager.title.tenantShortName'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'type',
      label: t('system.views.tenant.manager.title.type'),
      component: 'SmartApiSelectDict',
      componentProps: {
        dictCode: SYSTEM_TENANT_TYPE_DICT,
        labelWithCode: true,
      },
      required: true,
      defaultValue: '10',
    },
    {
      field: 'contacts',
      label: t('system.views.tenant.manager.title.contacts'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'contactPhone',
      label: t('system.views.tenant.manager.title.contactPhone'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'email',
      label: t('system.views.tenant.manager.title.email'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'isolationStrategy',
      label: t('system.views.tenant.manager.title.isolationStrategy'),
      component: 'Select',
      componentProps: () => {
        return {
          options: unref(isolationStrategyListRef),
        };
      },
      required: true,
    },
    {
      field: 'industry',
      label: t('system.views.tenant.manager.title.industry'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'domain',
      label: t('system.views.tenant.manager.title.domain'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'availableUserNum',
      label: t('system.views.tenant.manager.title.availableUserNum'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'region',
      label: t('system.views.tenant.manager.title.region'),
      component: 'Cascader',
      componentProps: {},
    },
    {
      field: 'effectExpireTime',
      label: t('system.views.tenant.manager.title.effectTime'),
      component: 'RangePicker',
      componentProps: {
        showTime: true,
      },
    },
    {
      field: 'seq',
      label: t('common.table.seq'),
      component: 'Input',
      componentProps: {},
      defaultValue: 1,
    },
    {
      field: 'address',
      label: t('system.views.tenant.manager.title.address'),
      component: 'InputTextArea',
      componentProps: {},
    },
    {
      field: 'remark',
      label: t('common.table.remark'),
      component: 'InputTextArea',
      componentProps: {},
    },
    {
      field: 'logoId',
      label: t('system.views.tenant.manager.title.logoId'),
      component: 'Input',
      componentProps: {},
    },
  ];
};

export const getSearchFormSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      field: 'tenantCode',
      label: t('system.views.tenant.manager.title.tenantCode'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      field: 'tenantName',
      label: t('system.views.tenant.manager.title.tenantName'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      field: 'tenantShortName',
      label: t('system.views.tenant.manager.title.tenantShortName'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      field: 'type',
      label: t('system.views.tenant.manager.title.type'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      field: 'isolationStrategy',
      label: t('system.views.tenant.manager.title.isolationStrategy'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      field: 'effectTime',
      label: t('system.views.tenant.manager.title.effectTime'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      field: 'expireTime',
      label: t('system.views.tenant.manager.title.expireTime'),
      component: 'Input',
      searchSymbol: '=',
    },
  ];
};
