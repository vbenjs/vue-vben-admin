import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';
import type { FormSchema } from '@/components/Form';
import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

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
      field: 'templateCode',
      title: '{smart.message.template.title.templateCode}',
      fixed: 'left',
      width: 120,
    },
    {
      field: 'templateName',
      title: '{smart.message.template.title.templateName}',
      fixed: 'left',
      width: 120,
    },
    {
      field: 'templateContent',
      title: '{smart.message.template.title.templateContent}',
      minWidth: 200,
    },
    {
      field: 'useYn',
      component: 'booleanTag',
      title: '{common.table.useYn}',
      width: 120,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 165,
    },
    {
      field: 'createBy',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'updateTime',
      title: '{common.table.updateTime}',
      width: 165,
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
      show: false,
      label: '',
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'templateCode',
      label: t('smart.message.template.title.templateCode'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'templateName',
      label: t('smart.message.template.title.templateName'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'templateContent',
      label: t('smart.message.template.title.templateContent'),
      slot: 'addEdit-templateContent',
      componentProps: {
        height: 600,
        imageAction: defHttp.getApiUrlByService(ApiServiceEnum.SMART_FILE) + '/smart/file/upload',
      },
    },
    {
      field: 'useYn',
      label: t('common.table.useYn'),
      component: 'Switch',
      defaultValue: true,
      componentProps: {},
    },
  ];
};

export const getSearchFormSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      field: 'templateCode',
      label: t('smart.message.template.title.templateCode'),
      component: 'Input',
      searchSymbol: '=',
    },
    {
      field: 'templateName',
      label: t('smart.message.template.title.templateName'),
      component: 'Input',
      searchSymbol: '=',
    },
  ];
};
