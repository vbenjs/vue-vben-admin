import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';
import type { FormSchema } from '@/components/Form';
import { tableUseYnClass } from '@/components/SmartTable';

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
      title: 'ID',
      width: 120,
    },
    {
      field: 'keyName',
      title: '{smart.auth.secret.title.keyName}',
      width: 120,
      fixed: 'left',
    },
    {
      field: 'fileStorageId',
      title: '{smart.auth.secret.title.fileStorageId}',
      width: 120,
      formatter: ({ row }) => {
        return row.fileStorage?.storageName;
      },
    },
    {
      field: 'seq',
      title: '{common.table.seq}',
      width: 120,
      sortable: true,
    },
    {
      ...tableUseYnClass(),
      width: 100,
      sortable: true,
    },
    {
      field: 'alias',
      title: '{smart.auth.secret.title.alias}',
      width: 120,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 120,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 160,
    },
    {
      field: 'createBy',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'updateTime',
      title: '{common.table.updateTime}',
      width: 160,
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
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

/**
 * 添加修改表单
 */
export const getFormSchemas = (t: Function): FormSchema[] => {
  return [
    {
      field: 'id',
      label: 'ID',
      component: 'Input',
      componentProps: {},
      show: false,
    },
    {
      field: 'keyName',
      label: t('smart.auth.secret.title.keyName'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'fileStorageId',
      label: t('system.views.file.title.fileStorageId'),
      component: 'SmartApiSelectTable',
      componentProps: {
        modelClassName: 'com.smart.file.manager.model.SmartFileStoragePO',
        valueFieldName: 'id',
        labelFieldName: 'storageName',
        params: {
          sortName: 'seq',
          parameter: {
            'deleteYn@<>': true,
            'useYn@=': true,
          },
        },
      },
      required: true,
    },
    {
      field: 'seq',
      label: t('common.table.seq'),
      component: 'InputNumber',
      componentProps: {},
      required: true,
      defaultValue: 1,
    },
    {
      field: 'storePassword',
      label: t('smart.auth.secret.title.storePassword'),
      component: 'InputPassword',
      componentProps: {},
      required: true,
    },
    {
      field: 'keyPassword',
      label: t('smart.auth.secret.title.keyPassword'),
      component: 'InputPassword',
      componentProps: {},
      required: true,
    },
    {
      field: 'alias',
      label: t('smart.auth.secret.title.alias'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'publicKeyFileList',
      label: t('smart.auth.secret.title.publicKeyFile'),
      componentProps: {},
      slot: 'form-publicKeyFile',
      required: true,
    },
    {
      field: 'privateKeyFileList',
      label: t('smart.auth.secret.title.privateKeyFile'),
      componentProps: {},
      slot: 'form-privateKeyFile',
      required: true,
    },
    {
      field: 'remark',
      label: t('common.table.remark'),
      component: 'Input',
      componentProps: {},
    },
  ];
};

export const getSearchFormSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      field: 'keyName',
      label: t('smart.auth.secret.title.keyName'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      field: 'useYn',
      label: t('common.table.useYn'),
      component: 'Select',
      searchSymbol: '=',
      componentProps: {
        style: {
          width: '120px',
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
