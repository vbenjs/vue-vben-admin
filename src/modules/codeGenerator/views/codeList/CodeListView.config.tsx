import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';

const tableTypeList = [
  {
    label: 'generator.views.code.title.tableType.single',
    value: '10',
    color: 'green',
  },
  {
    label: 'generator.views.code.title.tableType.main',
    value: '20',
    color: 'blue',
  },
  {
    label: 'generator.views.code.title.tableType.addendum',
    value: '30',
    color: 'purple',
  },
];

export const tableColumns = (t: Function): SmartColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      fixed: 'left',
    },
    {
      title: '{generator.views.code.table.connectionName}',
      field: 'connectionName',
      width: 160,
      fixed: 'left',
    },
    {
      title: '{generator.views.code.table.configName}',
      field: 'configName',
      width: 160,
      fixed: 'left',
    },
    {
      title: '{generator.views.code.table.tableName}',
      field: 'tableName',
      width: 160,
      fixed: 'left',
    },
    {
      title: '{generator.views.code.table.type}',
      field: 'type',
      width: 120,
      slots: {
        default: ({ row }) => {
          const value = row.type;
          if (value) {
            const filterList = tableTypeList.filter((item) => item.value === value);
            if (filterList.length > 0) {
              const data = filterList[0];
              return <a-tag color={data.color}>{t(data.label)}</a-tag>;
            }
          }
          return '';
        },
      },
    },
    {
      title: '{generator.views.code.table.remarks}',
      field: 'remarks',
      minWidth: 200,
    },
    {
      title: '{common.table.remark}',
      field: 'remark',
      minWidth: 200,
    },
    {
      title: '{common.table.createTime}',
      field: 'createTime',
      width: 165,
      sortable: true,
    },
    {
      title: '{common.table.createUser}',
      field: 'createBy',
      width: 120,
    },
    {
      title: '{common.table.updateTime}',
      field: 'updateTime',
      width: 165,
      sortable: true,
    },
    {
      title: '{common.table.updateUser}',
      field: 'updateBy',
      width: 120,
    },
    {
      title: '{common.table.operation}',
      field: 'operation',
      width: 140,
      fixed: 'right',
      slots: {
        default: 'table-operation',
      },
    },
  ];
};

export const searchFormColumns = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      field: 'tableName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: t('generator.views.code.table.tableName'),
      },
    },
    {
      field: 'type',
      label: '',
      component: 'Select',
      componentProps: {
        style: {
          width: '100px',
        },
        placeholder: t('generator.views.code.table.type'),
        options: tableTypeList.map((item) => {
          return {
            ...item,
            label: t(item.label),
          };
        }),
      },
    },
  ];
};
