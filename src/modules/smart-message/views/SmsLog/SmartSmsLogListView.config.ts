import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';

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
      field: 'id',
      visible: false,
      title: '',
      width: 120,
    },
    {
      field: 'channelId',
      title: '{smart.sms.log.title.channelId}',
      width: 120,
    },
    {
      field: 'isSuccess',
      title: '{smart.sms.log.title.isSuccess}',
      width: 120,
    },
    {
      field: 'sendParameter',
      visible: false,
      title: '{smart.sms.log.title.sendParameter}',
      width: 120,
    },
    {
      field: 'sendResult',
      visible: false,
      title: '{smart.sms.log.title.sendResult}',
      width: 120,
    },
    {
      field: 'errorMessage',
      visible: false,
      title: '{smart.sms.log.title.errorMessage}',
      width: 120,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 120,
    },
    {
      field: 'createBy',
      title: '{common.table.createUser}',
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

export const getSearchFormSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      field: 'channelId',
      label: t('smart.sms.log.title.channelId'),
      component: 'Select',
      searchSymbol: '=',
    },
    {
      field: 'isSuccess',
      label: t('smart.sms.log.title.isSuccess'),
      component: 'Select',
      searchSymbol: '=',
    },
    {
      field: 'createTime',
      label: t('common.table.createTime'),
      component: 'DatePicker',
      searchSymbol: '=',
    },
  ];
};
