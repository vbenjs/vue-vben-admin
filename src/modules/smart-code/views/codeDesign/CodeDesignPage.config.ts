import type { FormSchema } from '@/components/Form';

type ButtonType =
  | 'SEARCH'
  | 'RESET'
  | 'ADD'
  | 'EDIT'
  | 'DELETE'
  | 'EXCEL_IMPORT'
  | 'EXCEL_EXPORT'
  | 'COLUMN_SETTING'
  | 'ZOOM'
  | 'REFRESH'
  | 'SHOW_SEARCH'
  | 'PRINT';

interface Button {
  key: ButtonType;
  value: string;
}

const tableTypeList = [
  {
    label: 'generator.views.code.title.tableType.single',
    value: '10',
  },
  {
    label: 'generator.views.code.title.tableType.main',
    value: '20',
  },
  {
    label: 'generator.views.code.title.tableType.addendum',
    value: '30',
  },
];

const yesNoList = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
];

export const formSchemas = (t: Function): FormSchema[] => {
  return [
    {
      label: '',
      field: 'systemId',
      component: 'Input',
      show: false,
    },
    {
      label: t('generator.views.code.table.connectionName'),
      field: 'connectionId',
      slot: 'addEditForm-connectionId',
      required: true,
    },
    {
      label: t('generator.views.code.table.tableName'),
      field: 'tableName',
      component: 'Input',
      required: true,
    },
    {
      label: t('generator.views.code.table.configName'),
      field: 'configName',
      component: 'Input',
      required: true,
    },
    {
      label: t('generator.views.code.table.type'),
      field: 'type',
      component: 'Select',
      defaultValue: '10',
      componentProps: {
        options: tableTypeList.map((item) => ({ label: t(item.label), value: item.value })),
      },
    },
    // ------------ 第二行 ---------------------
    {
      label: t('generator.views.code.title.showCheckBox'),
      field: 'showCheckbox',
      component: 'RadioGroup',
      defaultValue: true,
      componentProps: {
        options: yesNoList,
      },
    },
    {
      label: t('generator.views.code.title.isPage'),
      field: 'page',
      component: 'RadioGroup',
      defaultValue: true,
      componentProps: {
        options: yesNoList,
      },
    },
    {
      label: t('generator.views.code.title.invented'),
      field: 'invented',
      component: 'RadioGroup',
      defaultValue: false,
      componentProps: {
        options: yesNoList,
      },
    },
    {
      label: t('generator.views.code.title.columnSort'),
      field: 'columnSort',
      component: 'RadioGroup',
      defaultValue: false,
      componentProps: {
        options: yesNoList,
      },
    },
    // ------------ 第三行 ---------------------
    {
      label: t('generator.views.code.title.leftButton'),
      field: 'leftButtonList',
      component: 'Select',
      defaultValue: ['ADD', 'DELETE'],
      componentProps: {
        mode: 'multiple',
        options: letButtonList.map((item) => ({
          label: item.value,
          value: item.key,
        })),
      },
    },
    {
      label: t('generator.views.code.title.rightButton'),
      field: 'rightButtonList',
      component: 'Select',
      defaultValue: ['ZOOM', 'REFRESH', 'SHOW_SEARCH', 'COLUMN_SETTING'],
      componentProps: {
        mode: 'multiple',
        options: rightButtonList.map((item) => ({
          label: item.value,
          value: item.key,
        })),
      },
    },
    {
      label: t('generator.views.code.title.rowButtonType.title'),
      field: 'rowButtonType',
      component: 'Select',
      defaultValue: 'NONE',
      componentProps: {
        options: rowButtonTypeList(t),
      },
    },
    {
      label: t('generator.views.code.title.rowButtonList'),
      field: 'rowButtonList',
      component: 'Select',
      componentProps: {
        mode: 'multiple',
        options: rowButtonList.map((item) => ({
          label: item.value,
          value: item.key,
        })),
      },
    },
    // ------------ 第四行 ---------------------
    {
      label: t('generator.views.code.title.formColNum'),
      field: 'formColNum',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        options: columnNumList(t, false),
      },
    },
    {
      label: t('generator.views.code.title.searchColNum'),
      field: 'searchColNum',
      component: 'Select',
      defaultValue: 0,
      componentProps: {
        options: columnNumList(t),
      },
    },
    {
      label: t('common.table.remark'),
      field: 'remark',
      component: 'Input',
    },
    {
      label: t('generator.views.code.title.i18nPrefix'),
      field: 'i18nPrefix',
      component: 'Input',
      required: true,
    },
    // ------------ 第五行 ---------------------
    {
      label: t('generator.views.code.title.relateTable'),
      field: 'addendumTableList',
      defaultValue: [],
      slot: 'addEditForm-RelateTable',
    },
    {
      label: '',
      field: 'id',
      slot: 'addEditForm-syncTable',
    },
  ];
};

/**
 * 左侧按钮列表
 */
const letButtonList: Button[] = [
  {
    key: 'SEARCH',
    value: '搜索',
  },
  {
    key: 'RESET',
    value: '重置',
  },
  {
    key: 'ADD',
    value: '添加',
  },
  {
    key: 'EDIT',
    value: '修改',
  },
  {
    key: 'DELETE',
    value: '删除',
  },
];

const rightButtonList: Button[] = [
  {
    key: 'EXCEL_IMPORT',
    value: 'Excel导入',
  },
  {
    key: 'EXCEL_EXPORT',
    value: 'Excel导出',
  },
  {
    key: 'COLUMN_SETTING',
    value: '列配置',
  },
  {
    key: 'ZOOM',
    value: '放大缩小',
  },
  {
    key: 'REFRESH',
    value: '刷新',
  },
  {
    key: 'SHOW_SEARCH',
    value: '显示搜索',
  },
  {
    key: 'PRINT',
    value: '打印',
  },
];

/**
 * 行按钮
 */
const rowButtonList = [
  {
    key: 'EDIT',
    value: '修改',
  },
  {
    key: 'DELETE',
    value: '删除',
  },
];

const columnNumList = (t: Function, hasZeroColumn = true) => {
  const column = [
    {
      value: 1,
      label: t('generator.views.code.title.colNum.one'),
    },
    {
      value: 2,
      label: t('generator.views.code.title.colNum.two'),
    },
    {
      value: 3,
      label: t('generator.views.code.title.colNum.three'),
    },
    {
      value: 4,
      label: t('generator.views.code.title.colNum.four'),
    },
  ];
  if (hasZeroColumn) {
    return [
      {
        value: 0,
        label: t('generator.views.design.title.colNum.zero'),
      },
    ].concat(column);
  }
  return column;
};

const rowButtonTypeList = (t: Function) => [
  {
    label: t('generator.views.code.title.rowButtonType.none'),
    value: 'NONE',
  },
  {
    label: t('generator.views.code.title.rowButtonType.single'),
    value: 'SINGLE',
  },
  {
    label: t('generator.views.code.title.rowButtonType.more'),
    value: 'MORE',
  },
  {
    label: t('generator.views.code.title.rowButtonType.text'),
    value: 'TEXT',
  },
];
