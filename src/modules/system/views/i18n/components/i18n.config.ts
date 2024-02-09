import type { SmartColumn } from '@/components/SmartTable';
import type { FormSchema } from '@/components/Form';
import dayjs from 'dayjs';
import { tableUseYnClass } from '@/components/SmartTable';

export const getI18nTableColumns = (): SmartColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'platform',
      title: '{system.views.i18n.i18n.titlePlatform}',
      width: 120,
    },
    {
      field: 'i18nCode',
      title: '{system.views.i18n.i18n.titleI18nCode}',
      minWidth: 260,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 200,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 160,
    },
    {
      field: 'createUser',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'updateTime',
      title: '{common.table.updateTime}',
      width: 160,
    },
    {
      field: 'updateUser',
      title: '{common.table.updateUser}',
      width: 120,
    },
    {
      ...tableUseYnClass(),
      sortable: true,
    },
    {
      field: 'seq',
      title: '{common.table.seq}',
      width: 120,
      sortable: true,
    },
    {
      field: 'i18nId',
      title: '{common.table.operation}',
      width: 120,
      fixed: 'right',
      slots: {
        default: 'table-operation',
      },
    },
  ];
};

export const getI18nAddEditSchemas = (t: Function): FormSchema[] => {
  return [
    {
      label: '',
      field: 'groupId',
      component: 'Input',
      show: false,
    },
    {
      label: '',
      field: 'i18nId',
      component: 'Input',
      show: false,
    },
    {
      label: t('system.views.i18n.i18n.titlePlatform'),
      field: 'platform',
      component: 'Select',
      required: true,
      componentProps: {
        options: [
          {
            label: 'backstage',
            value: 'backstage',
          },
        ],
      },
    },
    {
      label: t('system.views.i18n.i18n.titleI18nCode'),
      field: 'i18nCode',
      component: 'Input',
      required: true,
    },
    {
      label: t('common.table.remark'),
      field: 'remark',
      component: 'InputTextArea',
    },
    {
      label: t('common.table.seq'),
      field: 'seq',
      component: 'InputNumber',
      componentProps: {
        style: { width: '100%' },
      },
      required: true,
    },
  ];
};

export const getI18nItemListTableColumn = (): SmartColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '{system.views.i18n.i18nItem.titleLocale}',
      field: 'locale',
      width: 120,
    },
    {
      title: '{system.views.i18n.i18nItem.titleValue}',
      field: 'value',
      minWidth: 160,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 160,
      formatter: ({ cellValue }: any) => {
        if (cellValue) {
          return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss');
        }
        return '';
      },
    },
    {
      field: 'createUser',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'i18nItemId',
      title: '{common.table.operation}',
      width: 120,
      fixed: 'right',
      slots: {
        default: 'table-operation',
      },
    },
  ];
};

export const getI18nItemListAddEditFormSchema = (t: Function): FormSchema[] => {
  return [
    {
      label: '',
      field: 'i18nItemId',
      component: 'Input',
      show: false,
    },
    {
      label: t('system.views.i18n.i18nItem.titleLocale'),
      field: 'locale',
      component: 'Input',
      required: true,
    },
    {
      label: t('system.views.i18n.i18nItem.titleValue'),
      field: 'value',
      component: 'InputTextArea',
      required: true,
    },
  ];
};
