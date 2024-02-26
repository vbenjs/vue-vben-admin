import {
  type SmartColumn,
  type SmartSearchFormSchema,
  tableBooleanColumnClass,
} from '@/components/SmartTable';

export const getTableColumns = (): SmartColumn[] => {
  return [
    {
      title: '#',
      type: 'expand',
      fixed: 'left',
      width: 80,
      slots: {
        content: 'table-expand',
      },
    },
    {
      title: '{system.views.user.table.username}',
      field: 'username',
      width: 120,
      fixed: 'left',
    },
    {
      title: '{system.views.user.table.fullName}',
      field: 'fullName',
      width: 120,
      fixed: 'left',
    },
    {
      title: '{system.views.user.table.email}',
      field: 'email',
      minWidth: 160,
    },
    {
      title: '{system.views.user.table.mobile}',
      field: 'mobile',
      minWidth: 140,
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

export const getTableExpandColumns = (): SmartColumn[] => {
  return [
    {
      title: '{system.views.onlineUser.title.authType}',
      field: 'authType',
      width: 120,
    },
    {
      title: '{system.views.onlineUser.title.loginType}',
      field: 'loginType',
      width: 120,
    },
    {
      title: '{system.views.onlineUser.title.loginTime}',
      field: 'loginTime',
      sortable: true,
      width: 170,
    },
    {
      title: '{system.views.onlineUser.title.loginIp}',
      field: 'loginIp',
      minWidth: 200,
    },
    {
      ...tableBooleanColumnClass('{system.views.onlineUser.title.bindIp}', 'bindIp'),
      width: 120,
    },
    {
      title: '{common.table.operation}',
      field: 'operation',
      width: 120,
      fixed: 'right',
      slots: {
        default: 'expand-table-operation',
      },
    },
  ];
};

export const getSearchFormSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      label: t('system.views.user.table.username'),
      field: 'username',
      component: 'Input',
    },
  ];
};
