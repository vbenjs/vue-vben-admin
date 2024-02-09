import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';
import type { FormSchema } from '@/components/Form';

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
      field: 'fileId',
      visible: false,
      title: '{system.views.file.title.fileId}',
      width: 120,
    },
    {
      field: 'fileStorageId',
      title: '{system.views.file.title.fileStorageId}',
      width: 160,
      fixed: 'left',
      formatter: ({ row }) => {
        return row.fileStorage?.storageName;
      },
      sortable: true,
    },
    {
      field: 'filename',
      title: '{system.views.file.title.fileName}',
      width: 160,
      fixed: 'left',
    },
    {
      field: 'type',
      title: '{system.views.file.title.type}',
      width: 120,
      sortable: true,
    },
    {
      field: 'contentType',
      title: '{system.views.file.title.contentType}',
      width: 120,
    },
    {
      field: 'fileSize',
      title: '{system.views.file.title.fileSize}',
      width: 120,
      sortable: true,
    },
    {
      field: 'seq',
      title: '{common.table.seq}',
      width: 120,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 160,
      sortable: true,
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

/**
 * 添加修改表单
 */
export const getFormSchemas = (t: Function): FormSchema[] => {
  return [
    {
      field: 'fileId',
      show: false,
      label: t('system.views.file.title.fileId'),
      component: 'Input',
      componentProps: {},
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
      field: 'fileName',
      label: t('system.views.file.title.fileName'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'type',
      label: t('system.views.file.title.type'),
      component: 'SmartApiSelectDict',
      componentProps: {
        dictCode: 'FILE_TYPE',
      },
    },
    {
      field: 'seq',
      label: t('common.table.seq'),
      component: 'InputNumber',
      defaultValue: 1,
      componentProps: {},
      required: true,
    },
    {
      field: 'fileList',
      label: '文件',
      slot: 'form-upload',
      required: true,
    },
  ];
};

export const getSearchFormSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      field: 'fileName',
      label: t('system.views.file.title.fileName'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      field: 'type',
      label: t('system.views.file.title.type'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      field: 'fileStorageId',
      label: t('system.views.file.title.fileStorageId'),
      component: 'SmartApiSelectTable',
      componentProps: {
        style: {
          width: '150px',
        },
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
      searchSymbol: '=',
    },
  ];
};
