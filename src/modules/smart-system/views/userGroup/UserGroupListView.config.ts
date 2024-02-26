import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';
import { tableUseYnClass } from '@/components/SmartTable';
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
      title: '{system.views.userGroup.table.groupCode}',
      field: 'groupCode',
      fixed: 'left',
      width: 160,
    },
    {
      title: '{system.views.userGroup.table.groupName}',
      field: 'groupName',
      fixed: 'left',
      width: 120,
    },
    {
      ...tableUseYnClass(),
      sortable: true,
    },
    {
      title: '{common.table.remark}',
      field: 'remark',
      minWidth: 160,
    },
    {
      title: '{common.table.seq}',
      field: 'seq',
      width: 100,
      sortable: true,
    },
    {
      title: '{common.table.createTime}',
      field: 'createTime',
      width: 165,
      sortable: true,
    },
    {
      title: '{common.table.createUser}',
      field: 'createUserId',
      width: 120,
      formatter: ({ row }: any) => {
        if (row.createUser) {
          return row.createUser.fullName;
        }
        return '';
      },
    },
    {
      title: '{common.table.updateTime}',
      field: 'updateTime',
      width: 165,
      sortable: true,
    },
    {
      title: '{common.table.updateUser}',
      field: 'updateUserId',
      width: 120,
      formatter: ({ row }: any) => {
        if (row.updateUser) {
          return row.updateUser.fullName;
        }
        return '';
      },
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

export const getSearchSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      label: t('system.views.userGroup.table.groupCode'),
      field: 'groupCode',
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      label: t('system.views.userGroup.table.groupName'),
      field: 'groupName',
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      label: t('system.views.userGroup.search.useYnTitle'),
      field: 'useYn',
      component: 'Select',
      defaultValue: 1,
      searchSymbol: '=',
      componentProps: {
        style: {
          width: '100px',
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

export const getAddEditFormSchemas = (t: Function): FormSchema[] => {
  return [
    {
      label: '',
      field: 'groupId',
      component: 'Input',
      show: false,
    },
    {
      label: t('system.views.userGroup.table.groupCode'),
      field: 'groupCode',
      component: 'Input',
      required: true,
    },
    {
      label: t('system.views.userGroup.table.groupName'),
      field: 'groupName',
      component: 'Input',
      required: true,
    },
    {
      label: t('common.table.useYn'),
      field: 'useYn',
      component: 'Switch',
      defaultValue: true,
    },
    {
      label: t('common.table.seq'),
      field: 'seq',
      component: 'InputNumber',
      defaultValue: 1,
      required: true,
    },
    {
      label: t('common.table.remark'),
      field: 'remark',
      component: 'InputTextArea',
    },
  ];
};
