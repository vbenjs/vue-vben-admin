import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';
import type { FormSchema } from '@/components/Form';

export const getTableColumns = (): SmartColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'licenseCode',
      title: '{smart.license.title.licenseCode}',
      width: 120,
      fixed: 'left',
    },
    {
      field: 'licenseName',
      title: '{smart.license.title.licenseName}',
      width: 120,
      fixed: 'left',
    },
    {
      field: 'macAddress',
      title: '{smart.license.title.macAddress}',
      width: 200,
    },
    {
      field: 'ipAddress',
      title: '{smart.license.title.ipAddress}',
      width: 200,
    },
    {
      field: 'cpuSerial',
      title: '{smart.license.title.cpuSerial}',
      width: 200,
    },
    {
      field: 'mainBoardSerial',
      title: '{smart.license.title.mainBoardSerial}',
      width: 200,
    },
    {
      field: 'enterprise',
      title: '{smart.license.title.enterprise}',
      width: 160,
    },
    {
      field: 'version',
      title: '{smart.license.title.version}',
      width: 160,
      sortable: true,
    },
    {
      field: 'contractNo',
      title: '{smart.license.title.contractNo}',
      width: 160,
    },
    {
      field: 'effectiveTime',
      title: '{smart.license.title.effectiveTime}',
      width: 160,
      sortable: true,
    },
    {
      field: 'expirationTime',
      title: '{smart.license.title.expirationTime}',
      width: 160,
      sortable: true,
    },
    {
      field: 'status',
      title: '{smart.license.title.status}',
      width: 120,
      sortable: true,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 160,
    },
    {
      field: 'seq',
      title: '{common.table.seq}',
      width: 100,
      sortable: true,
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
      width: 145,
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
      label: t('smart.license.title.licenseCode'),
      field: 'licenseCode',
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      label: t('smart.license.title.licenseName'),
      field: 'licenseName',
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      label: t('smart.license.title.version'),
      field: 'version',
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      label: t('smart.license.title.status'),
      field: 'status',
      component: 'Input',
      searchSymbol: '=',
    },
  ];
};

export const getAddEditFormSchemas = (t: Function): FormSchema[] => {
  return [
    {
      label: '',
      field: 'id',
      component: 'Input',
      show: false,
    },
    {
      label: t('smart.license.title.basic'),
      field: 'id',
      component: 'Divider',
      colProps: {
        span: 24,
      },
      componentProps: {
        class: ['form-divider'],
      },
    },
    {
      label: t('smart.license.title.licenseCode'),
      field: 'licenseCode',
      componentProps: {
        disabled: true,
      },
      component: 'Input',
    },
    {
      label: t('smart.license.title.licenseName'),
      field: 'licenseName',
      component: 'Input',
      required: true,
    },
    {
      label: t('smart.license.title.times'),
      field: 'times',
      component: 'RangePicker',
      required: true,
      componentProps: {
        style: {
          width: '100%',
        },
      },
    },
    {
      label: t('common.table.seq'),
      field: 'seq',
      required: true,
      defaultValue: 1,
      component: 'InputNumber',
    },
    {
      label: t('smart.license.title.subject'),
      field: 'subject',
      component: 'Input',
      required: true,
    },
    {
      label: '',
      field: 'status',
      component: 'Input',
      show: false,
    },
    {
      label: t('smart.license.title.secretKey'),
      field: 'secretKeyId',
      required: true,
      slot: 'form-secretKey',
    },
    {
      label: t('smart.license.title.fileStorage'),
      field: 'fileStorageId',
      component: 'SmartApiSelectTable',
      required: true,
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
    },
    {
      label: t('smart.license.title.serverInfo'),
      field: 'id',
      component: 'Divider',
      colProps: {
        span: 24,
      },
      componentProps: {
        class: ['form-divider'],
      },
    },
    {
      label: t('smart.license.title.macAddress'),
      field: 'macAddress',
      component: 'Input',
    },
    {
      label: t('smart.license.title.ipAddress'),
      field: 'ipAddress',
      component: 'Input',
    },
    {
      label: t('smart.license.title.cpuSerial'),
      field: 'cpuSerial',
      component: 'Input',
    },
    {
      label: t('smart.license.title.mainBoardSerial'),
      field: 'mainBoardSerial',
      component: 'Input',
    },
    {
      label: t('smart.license.title.projectInfo'),
      field: 'id',
      component: 'Divider',
      colProps: {
        span: 24,
      },
      componentProps: {
        class: ['form-divider'],
      },
    },
    {
      label: t('smart.license.title.enterprise'),
      field: 'enterprise',
      component: 'Input',
    },
    {
      label: t('smart.license.title.project'),
      field: 'systemName',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      label: '',
      field: 'systemId',
      component: 'Input',
      show: false,
    },
    {
      label: t('smart.license.title.version'),
      field: 'version',
      component: 'Input',
    },
    {
      label: t('smart.license.title.contractNo'),
      field: 'contractNo',
      component: 'Input',
    },
  ];
};

export enum Permissions {
  save = 'sys:license:save',
  update = 'sys:license:update',
  query = 'sys:license:query',
  delete = 'sys:license:delete',
  generator = 'sys:license:generator',
  download = 'sys:license:download',
}
