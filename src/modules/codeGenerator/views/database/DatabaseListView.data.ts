import type { FormSchema } from '@/components/Form';
import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';

const dbTypeList = ['MYSQL', 'SQL_SERVER', 'ORACLE'];

export const tableColumns: SmartColumn[] = [
  {
    type: 'checkbox',
    width: 60,
    align: 'center',
    fixed: 'left',
  },
  {
    title: '{generator.views.database.table.connectionName}',
    field: 'connectionName',
    width: 160,
    fixed: 'left',
  },
  {
    title: '{generator.views.database.table.databaseName}',
    field: 'databaseName',
    width: 160,
    fixed: 'left',
  },
  {
    title: '{generator.views.database.table.type}',
    field: 'type',
    width: 120,
  },
  {
    title: '{generator.views.database.table.url}',
    field: 'url',
    minWidth: 200,
    showOverflow: 'tooltip',
  },
  {
    title: '{generator.views.database.table.username}',
    field: 'username',
    width: 120,
  },
  {
    title: '{generator.views.database.table.tableSchema}',
    field: 'tableSchema',
    width: 120,
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
    width: 120,
    fixed: 'right',
    slots: {
      default: 'table-operation',
    },
  },
];

export const addEditForm: (t: Function) => Array<FormSchema> = (t: Function) => {
  return [
    {
      field: 'id',
      component: 'Input',
      show: false,
    },
    {
      field: 'systemId',
      component: 'Input',
      show: false,
    },
    {
      label: t('generator.views.database.table.connectionName'),
      field: 'connectionName',
      component: 'Input',
      componentProps: {
        placeholder: t('generator.views.database.validate.connectionName'),
      },
      required: true,
    },
    {
      label: t('generator.views.database.table.databaseName'),
      field: 'databaseName',
      component: 'Input',
      componentProps: {
        placeholder: t('generator.views.database.validate.databaseName'),
      },
      required: true,
    },
    {
      label: t('generator.views.database.table.type'),
      field: 'type',
      component: 'Select',
      componentProps: {
        placeholder: t('generator.views.database.validate.type'),
        options: dbTypeList.map((item) => {
          return {
            label: item,
            value: item,
          };
        }),
      },
      rules: [
        {
          message: t('generator.views.database.validate.type'),
          required: true,
          trigger: 'change',
        },
      ],
    },
    {
      label: t('generator.views.database.table.url'),
      field: 'url',
      component: 'InputTextArea',
      componentProps: {
        placeholder: t('generator.views.database.validate.url'),
        rows: 4,
      },
      required: true,
    },
    {
      label: t('generator.views.database.table.username'),
      field: 'username',
      component: 'Input',
      componentProps: {
        placeholder: t('generator.views.database.validate.username'),
      },
      required: true,
    },
    {
      label: t('generator.views.database.table.password'),
      field: 'password',
      component: 'InputPassword',
      componentProps: {
        placeholder: t('generator.views.database.validate.password'),
      },
      required: true,
    },
    {
      label: t('generator.views.database.table.tableSchema'),
      field: 'tableSchema',
      component: 'Input',
      componentProps: {},
    },
  ] as FormSchema[];
};

/**
 * 搜索表单配置
 * @param t
 */
export const searchForm: (t: Function) => SmartSearchFormSchema[] = (t: Function) => {
  return [
    {
      field: 'connectionName',
      component: 'Input',
      componentProps: {
        placeholder: t('generator.views.database.table.connectionName'),
      },
      colProps: { span: 6 },
      searchSymbol: 'likeRight',
      label: '',
    },
    {
      field: 'databaseName',
      component: 'Input',
      componentProps: {
        placeholder: t('generator.views.database.table.databaseName'),
      },
      colProps: { span: 6 },
      searchSymbol: '=',
      label: '',
    },
    {
      field: 'project',
      component: 'Input',
      componentProps: {
        placeholder: t('generator.views.database.table.project'),
      },
      colProps: { span: 6 },
      searchSymbol: 'likeLeft',
      label: '',
    },
  ];
};
