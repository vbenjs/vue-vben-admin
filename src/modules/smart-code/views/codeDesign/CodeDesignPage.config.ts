import type { FormSchema } from '@/components/Form';
import { SmartColumn } from '@/components/SmartTable';

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
  | 'PRINT'
  | 'USE_YN_TRUE'
  | 'USE_YN_FALSE';

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
      label: '权限前缀',
      field: 'permissionPrefix',
      component: 'Input',
    },
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
  {
    key: 'USE_YN_TRUE',
    value: '启用',
  },
  {
    key: 'USE_YN_FALSE',
    value: '停用',
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

/**
 * 获取table column
 */
export const getTableFiledColumns = (): SmartColumn[] => {
  return [
    {
      field: 'columnName',
      title: '{generator.views.tableField.title.columnName}',
      width: 160,
      align: 'left',
      headerAlign: 'center',
    },
    {
      field: 'typeName',
      title: '{generator.views.tableField.title.typeName}',
      width: 120,
    },
    {
      field: 'columnSize',
      title: '{generator.views.tableField.title.columnSize}',
      width: 120,
    },
    {
      field: 'decimalDigits',
      title: '{generator.views.tableField.title.decimalDigits}',
      width: 120,
    },
    {
      field: 'columnDef',
      title: '{generator.views.tableField.title.columnDef}',
      width: 120,
    },
    {
      field: 'nullable',
      title: '{generator.views.tableField.title.nullable}',
      width: 120,
      autoClass: 'Boolean',
      formatter({ row }) {
        const value = row.nullable;
        if (value === 0) {
          return '否';
        }
        return '是';
      },
    },
    {
      field: 'remarks',
      title: '{generator.views.tableField.title.remarks}',
      minWidth: 120,
      align: 'left',
      headerAlign: 'center',
    },
    {
      field: 'primaryKey',
      title: '{generator.views.tableField.title.primaryKey}',
      width: 120,
      autoClass: 'Boolean',
      formatter({ row }) {
        const value = row.primaryKey;
        if (value) {
          return '是';
        }
        return '';
      },
    },
    {
      field: 'indexed',
      title: '{generator.views.tableField.title.indexed}',
      width: 120,
      autoClass: 'Boolean',
      formatter({ row }) {
        const value = row.indexed;
        if (value) {
          return '是';
        }
        return '';
      },
    },
  ];
};

export const getPageSearchSettingColumn = (t: Function): SmartColumn[] => {
  const controlFormatMap = {};
  const controlFormatList = controlList.map(({ key, value }) => {
    const label = t(value);
    controlFormatMap[key] = label;
    return {
      label: label,
      value: key,
    };
  });

  return [
    {
      title: '{generator.views.tableField.title.columnName}',
      field: 'columnName',
      width: 160,
      align: 'left',
      headerAlign: 'center',
    },
    {
      title: '{generator.views.tableSetting.title.title}',
      field: 'title',
      width: 160,
      align: 'left',
      headerAlign: 'center',
      editRender: {
        name: 'AInput',
        autofocus: true,
      },
    },
    {
      title: '{generator.views.formSetting.title.controlType}',
      field: 'controlType',
      width: 150,
      editRender: {
        name: 'ASelect',
        autofocus: true,
        props: (row) => {
          return {
            disabled: !row.visible,
            options: controlFormatList,
          };
        },
      },
      formatter({ row }) {
        const value = row.controlType;
        if (!value) {
          return '';
        }
        return controlFormatMap[value];
      },
    },
    {
      title: '{generator.views.formSetting.title.readonly}',
      field: 'readonly',
      width: 110,
      editRender: {
        name: 'ASwitch',
        props: (row) => {
          return {
            disabled: !row.visible,
          };
        },
      },
      formatter({ row }) {
        const value = row.readonly;
        if (value) {
          return '是';
        }
        return '否';
      },
      autoClass: 'Boolean',
    },
    {
      title: '{generator.views.tableSetting.title.visible}',
      field: 'visible',
      width: 110,
      editRender: {
        name: 'ASwitch',
      },
      formatter({ row }) {
        const value = row.visible;
        if (value) {
          return '是';
        }
        return '否';
      },
      autoClass: 'Boolean',
    },
    {
      title: '{generator.views.tableSetting.title.hidden}',
      field: 'hidden',
      width: 110,
      editRender: {
        name: 'ASwitch',
        props: (row) => {
          return {
            disabled: !row.visible,
          };
        },
      },
      formatter({ row }) {
        const value = row.hidden;
        if (value) {
          return '是';
        }
        return '否';
      },
      autoClass: 'Boolean',
    },
    {
      title: '{generator.views.formSetting.title.used}',
      field: 'used',
      width: 120,
      editRender: {
        name: 'ASwitch',
        props: (row) => {
          return {
            disabled: !row.visible,
          };
        },
      },
      formatter({ row }) {
        const value = row.used;
        if (value) {
          return '是';
        }
        return '否';
      },
      autoClass: 'Boolean',
    },
    {
      title: '{generator.views.searchSetting.title.searchSymbol}',
      field: 'searchSymbol',
      width: 120,
      editRender: {
        name: 'ASelect',
        autofocus: true,
        props: (row) => {
          return {
            disabled: !row.visible,
            options: searchSymbolList.map((item) => {
              return {
                label: item,
                value: item,
              };
            }),
          };
        },
      },
    },
    {
      title: '{generator.views.formSetting.title.useTableSearch}',
      field: 'useTableSearch',
      width: 110,
      editRender: {
        name: 'ASwitch',
        props: (row) => {
          return {
            disabled: !row.visible,
          };
        },
      },
      formatter({ row }) {
        const value = row.useTableSearch;
        if (value) {
          return '是';
        }
        return '否';
      },
      autoClass: 'Boolean',
    },
    {
      title: '{generator.views.code.table.tableName}',
      field: 'tableName',
      width: 120,
      editRender: {
        name: 'AInput',
        autofocus: true,
        props: (row) => {
          return {
            disabled: !(row.useTableSearch && row.visible),
          };
        },
      },
    },
    {
      title: '{generator.views.formSetting.title.keyColumnName}',
      field: 'keyColumnName',
      width: 120,
      editRender: {
        name: 'AInput',
        autofocus: true,
        props: (row) => {
          return {
            disabled: !(row.useTableSearch && row.visible),
          };
        },
      },
    },
    {
      title: '{generator.views.formSetting.title.valueColumnName}',
      field: 'valueColumnName',
      width: 120,
      editRender: {
        name: 'AInput',
        autofocus: true,
        props: (row) => {
          return {
            disabled: !(row.useTableSearch && row.visible),
          };
        },
      },
    },
    {
      title: '{generator.views.formSetting.title.tableWhere}',
      field: 'tableWhere',
      minWidth: 180,
      editRender: {
        name: 'AInput',
        autofocus: true,
        props: (row) => {
          return {
            disabled: !(row.useTableSearch && row.visible),
          };
        },
      },
    },
    {
      title: '{generator.views.code.table.remarks}',
      field: 'remarks',
      minWidth: 160,
      align: 'left',
      headerAlign: 'center',
    },
  ];
};

const controlList = [
  {
    key: 'INPUT',
    value: 'generator.views.code.title.controlList.input',
  },
  {
    key: 'TEXTAREA',
    value: 'generator.views.code.title.controlList.textarea',
  },
  {
    key: 'NUMBER',
    value: 'generator.views.code.title.controlList.number',
  },
  {
    key: 'PASSWORD',
    value: 'generator.views.code.title.controlList.password',
  },
  {
    key: 'SELECT',
    value: 'generator.views.code.title.controlList.select',
  },
  {
    key: 'TRANSFER',
    value: 'generator.views.code.title.controlList.transfer',
  },
  {
    key: 'SELECT_TABLE',
    value: 'generator.views.code.title.controlList.selectTable',
  },
  {
    key: 'RADIO',
    value: 'generator.views.code.title.controlList.radio',
  },
  {
    key: 'CHECKBOX',
    value: 'generator.views.code.title.controlList.checkbox',
  },
  {
    key: 'SWITCH_TYPE',
    value: 'generator.views.code.title.controlList.switch_type',
  },
  {
    key: 'DATE',
    value: 'generator.views.code.title.controlList.date',
  },
  {
    key: 'TIME',
    value: 'generator.views.code.title.controlList.time',
  },
  {
    key: 'DATETIME',
    value: 'generator.views.code.title.controlList.datetime',
  },
  {
    key: 'FILE',
    value: 'generator.views.code.title.controlList.file',
  },
  {
    key: 'DATA_DICT',
    value: 'generator.views.design.title.controlList.dataDict',
  },
  {
    key: 'CATEGORY_DICT',
    value: 'generator.views.design.title.controlList.categoryDict',
  },
];

/**
 * 查询标识列表
 */
export const searchSymbolList = [
  '=',
  'like',
  '>',
  '>=',
  '<',
  '<=',
  'in',
  'notIn',
  'notLike',
  'likeLeft',
  'likeRight',
];
