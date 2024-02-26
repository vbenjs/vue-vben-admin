import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';
import type { FormSchema } from '@/components/Form';

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
      title: '{system.views.system.title.code}',
      width: 160,
      fixed: 'left',
    },
    {
      field: 'name',
      title: '{system.views.system.title.name}',
      width: 160,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 200,
    },
    {
      field: 'enterprise',
      title: '{system.views.system.title.enterprise}',
      width: 120,
    },
    {
      field: 'version',
      title: '{system.views.system.title.version}',
      width: 120,
    },
    {
      field: 'seq',
      title: '{common.table.seq}',
      width: 100,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 170,
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
      width: 170,
      sortable: true,
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
    {
      field: 'id',
      title: '{common.table.operation}',
      fixed: 'right',
      width: 170,
      slots: {
        default: 'table-option',
      },
    },
  ];
};

export const getFormSchemas = (t: Function): FormSchema[] => {
  return [
    {
      field: 'id',
      label: '',
      component: 'Input',
      show: false,
    },
    {
      field: 'code',
      label: t('system.views.system.title.code'),
      component: 'Input',
      required: true,
    },
    {
      field: 'name',
      label: t('system.views.system.title.name'),
      component: 'Input',
      required: true,
    },
    {
      field: 'remark',
      label: t('common.table.remark'),
      component: 'Input',
    },
    {
      field: 'enterprise',
      label: t('system.views.system.title.enterprise'),
      component: 'Input',
    },
    {
      field: 'version',
      label: t('system.views.system.title.version'),
      component: 'Input',
    },
    {
      field: 'seq',
      label: t('common.table.seq'),
      component: 'InputNumber',
      componentProps: {
        style: 'width: 100%',
      },
      defaultValue: 1,
      required: true,
    },
  ];
};

export const getSearchFormSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      field: 'code',
      label: t('system.views.system.title.code'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      field: 'name',
      label: t('system.views.system.title.name'),
      component: 'Input',
      searchSymbol: 'like',
    },
  ];
};
