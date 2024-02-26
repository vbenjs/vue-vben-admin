import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';
import { tableUseYnClass } from '@/components/SmartTable';
import { FormSchema } from '@/components/Form';

export const getDataDictGroupColumns = (): SmartColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '{system.views.dictGroup.title.dictCode}',
      field: 'dictCode',
      width: 180,
      // filters: [{ data: '' }],
      // slots: {
      //   filter: 'dictCode-filter',
      // },
      fixed: 'left',
    },
    {
      title: '{system.views.dictGroup.title.dictName}',
      field: 'dictName',
      minWidth: 180,
      // filters: [{ data: '' }],
      // slots: {
      //   filter: 'dictName-filter',
      // },
    },
    {
      title: '{common.table.seq}',
      field: 'seq',
      sortable: true,
      width: 120,
    },
    {
      ...tableUseYnClass(),
      sortable: true,
      width: 120,
      // filterMultiple: false,
      // filters: [
      //   { label: 'YES', data: true },
      //   { label: 'NO', data: false },
      // ],
    },
    {
      title: '{common.table.remark}',
      field: 'remark',
      width: 120,
      // filters: [{ data: '' }],
      // slots: {
      //   filter: 'dictName-filter',
      // },
    },
  ];
};

export const getDataDictGroupSearchSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      label: t('system.views.dictGroup.title.dictCode'),
      field: 'dictCode',
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {
        style: { width: '120px' },
      },
    },
    {
      label: t('system.views.dictGroup.title.dictName'),
      field: 'dictName',
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {
        style: { width: '120px' },
      },
    },
    {
      label: t('system.views.userGroup.search.useYnTitle'),
      field: 'useYn',
      component: 'Select',
      defaultValue: 1,
      searchSymbol: '=',
      componentProps: {
        style: {
          width: '80px',
        },
        options: [
          {
            label: t('common.form.use'),
            value: 1,
          },
          {
            label: t('common.form.noUse'),
            value: 0,
          },
        ],
      },
    },
  ];
};

export const getDataDictGroupAddEditSchemas = (t: Function): FormSchema[] => {
  return [
    {
      label: '',
      field: 'id',
      component: 'Input',
      show: false,
    },
    {
      label: t('system.views.dictGroup.title.dictCode'),
      field: 'dictCode',
      component: 'Input',
      required: true,
    },
    {
      label: t('system.views.dictGroup.title.dictName'),
      field: 'dictName',
      component: 'Input',
      required: true,
    },
    {
      label: t('common.table.seq'),
      field: 'seq',
      component: 'InputNumber',
      required: true,
      defaultValue: 1,
    },
    {
      label: t('common.table.useYn'),
      field: 'useYn',
      component: 'Switch',
      defaultValue: true,
    },
    {
      label: t('common.table.remark'),
      field: 'remark',
      component: 'Input',
    },
  ];
};

export const getDataDictItemColumns = (): SmartColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'dictItemCode',
      fixed: 'left',
      title: '{system.views.dictItem.title.dictItemCode}',
      width: 160,
    },
    {
      field: 'dictItemName',
      title: '{system.views.dictItem.title.dictItemName}',
      width: 180,
    },
    {
      field: 'seq',
      sortable: true,
      title: '{common.table.seq}',
      width: 100,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 200,
    },
    {
      ...tableUseYnClass(),
      sortable: true,
    },
    {
      field: 'createBy',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 180,
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
    {
      field: 'updateTime',
      title: '{common.table.updateTime}',
      width: 170,
    },
  ];
};

export const getDataDictItemAddEditSchemas = (t: Function): FormSchema[] => {
  return [
    {
      label: 'id',
      field: 'id',
      component: 'Input',
      show: false,
    },
    {
      label: t('system.views.dictItem.title.dictItemCode'),
      field: 'dictItemCode',
      component: 'Input',
      required: true,
    },
    {
      label: t('system.views.dictItem.title.dictItemName'),
      field: 'dictItemName',
      component: 'Input',
      required: true,
    },
    {
      label: t('common.table.seq'),
      field: 'seq',
      component: 'InputNumber',
      required: true,
      defaultValue: 1,
    },
    {
      label: t('common.table.useYn'),
      field: 'useYn',
      component: 'Switch',
      defaultValue: true,
    },
    {
      label: t('common.table.remark'),
      field: 'remark',
      component: 'Input',
    },
  ];
};
