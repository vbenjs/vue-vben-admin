import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';
import { tableBooleanColumnClass } from '@/components/SmartTable';

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
      field: 'exceptionMessage',
      fixed: 'left',
      title: '{system.views.exception.title.exceptionMessage}',
      width: 200,
    },
    {
      field: 'requestIp',
      title: '{system.views.exception.title.requestIp}',
      width: 120,
    },
    {
      field: 'serverIp',
      title: '{system.views.exception.title.serverIp}',
      width: 120,
    },
    {
      field: 'requestPath',
      title: '{system.views.exception.title.requestPath}',
      width: 200,
    },
    {
      field: 'operateBy',
      title: '{system.views.exception.title.operateUser}',
      width: 120,
    },
    {
      field: 'createTime',
      sortable: true,
      title: '{common.table.createTime}',
      width: 150,
    },
    {
      ...tableBooleanColumnClass('{system.views.exception.title.userFeedback}', 'userFeedback'),
      width: 120,
      sortable: true,
    },
    {
      field: 'feedbackMessage',
      title: '{system.views.exception.title.feedbackMessage}',
      width: 160,
    },
    {
      field: 'feedbackTime',
      title: '{system.views.exception.title.feedbackTime}',
      width: 150,
    },
    {
      ...tableBooleanColumnClass('{system.views.exception.title.resolved}', 'resolved'),
      width: 120,
      sortable: true,
    },
    {
      field: 'resolvedMessage',
      title: '{system.views.exception.title.resolvedMessage}',
      width: 160,
    },
    {
      field: 'resolvedUserId',
      title: '{system.views.exception.title.resolvedUserId}',
      width: 120,
    },
    {
      field: 'resolvedTime',
      title: '{system.views.exception.title.resolvedTime}',
      width: 150,
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

const getYesNoOptions = (t: Function) => {
  return [
    {
      label: t('common.form.yes'),
      value: 1,
    },
    {
      label: t('common.form.no'),
      value: 0,
    },
  ];
};

export const getSearchFormSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      label: t('system.views.exception.title.exceptionMessage'),
      field: 'exceptionMessage',
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {
        style: { width: '150px' },
      },
    },
    {
      label: t('system.views.exception.title.requestIp'),
      field: 'requestIp',
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {
        style: { width: '150px' },
      },
    },
    {
      label: t('system.views.exception.title.serverIp'),
      field: 'serverIp',
      component: 'Input',
      searchSymbol: 'like',
      componentProps: {
        style: { width: '150px' },
      },
    },
    {
      label: t('system.views.exception.title.userFeedback'),
      field: 'userFeedback',
      component: 'Select',
      searchSymbol: '=',
      componentProps: {
        options: getYesNoOptions(t),
        style: { width: '150px' },
      },
    },
    {
      label: t('system.views.exception.title.resolved'),
      field: 'resolved',
      component: 'Select',
      searchSymbol: '=',
      componentProps: {
        options: getYesNoOptions(t),
        style: { width: '150px' },
      },
    },
  ];
};
