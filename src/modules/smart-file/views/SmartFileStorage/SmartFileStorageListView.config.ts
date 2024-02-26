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
      field: 'id',
      visible: false,
      title: '{smart.file.storage.title.id}',
      width: 120,
    },
    {
      field: 'storageCode',
      title: '{smart.file.storage.title.storageCode}',
      width: 160,
      fixed: 'left',
    },
    {
      field: 'storageName',
      title: '{smart.file.storage.title.storageName}',
      width: 160,
      fixed: 'left',
    },
    {
      field: 'storageType',
      sortable: true,
      title: '{smart.file.storage.title.storageType}',
      width: 120,
      slots: {
        default: 'table-storageType',
      },
    },
    {
      field: 'seq',
      sortable: true,
      title: '{common.table.seq}',
      width: 120,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 120,
    },
    {
      field: 'defaultStorage',
      title: '{smart.file.storage.title.defaultStorage}',
      width: 140,
      component: 'switch',
      componentProps: {
        disabled: true,
      },
    },
    // {
    //   field: 'storageConfig',
    //   title: '{smart.file.storage.title.storageConfig}',
    //   width: 120,
    // },
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
      field: 'updateTime',
      title: '{common.table.updateTime}',
      width: 160,
      sortable: true,
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
    {
      title: '{common.table.useYn}',
      field: 'useYn',
      width: 100,
      component: 'booleanTag',
    },
    {
      title: '{common.table.operation}',
      field: 'operation',
      width: 150,
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
      label: t('smart.file.storage.title.id'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'storageCode',
      label: t('smart.file.storage.title.storageCode'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'storageName',
      label: t('smart.file.storage.title.storageName'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    // {
    //   field: 'defaultStorage',
    //   label: t('smart.file.storage.title.defaultStorage'),
    //   component: 'Switch',
    //   componentProps: {},
    //   colProps: {
    //     span: 12,
    //   },
    // },
    {
      field: 'useYn',
      label: t('common.table.useYn'),
      component: 'Switch',
      componentProps: {},
      defaultValue: true,
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
      field: 'remark',
      label: t('common.table.remark'),
      component: 'InputTextArea',
      componentProps: {},
    },
    {
      field: 'storageType',
      label: t('smart.file.storage.title.storageType'),
      component: 'SmartApiSelectDict',
      componentProps: {
        dictCode: 'FILE_STORAGE_TYPE',
      },
      required: true,
    },
    // --------------自定义配置信息
    // 磁盘存储配置
    {
      field: 'storageConfig.DISK.basePath',
      component: 'Input',
      label: t('smart.file.storage.title.basePath'),
      show: ({ model }) => {
        return model.storageType === 'DISK';
      },
      required: ({ model }) => model.storageType === 'DISK',
    },
    // ---------- minio配置
    {
      field: 'storageConfig.MINIO.endpoint',
      component: 'Input',
      label: t('smart.file.storage.title.endpoint'),
      show: ({ model }) => {
        return model.storageType === 'MINIO';
      },
      required: ({ model }) => model.storageType === 'MINIO',
    },
    {
      field: 'storageConfig.MINIO.accessKey',
      component: 'Input',
      label: t('smart.file.storage.title.accessKey'),
      show: ({ model }) => {
        return model.storageType === 'MINIO';
      },
      required: ({ model }) => model.storageType === 'MINIO',
    },
    {
      field: 'storageConfig.MINIO.secretKey',
      component: 'Input',
      label: t('smart.file.storage.title.secretKey'),
      show: ({ model }) => {
        return model.storageType === 'MINIO';
      },
      required: ({ model }) => model.storageType === 'MINIO',
    },
    {
      field: 'storageConfig.MINIO.bucketName',
      component: 'Input',
      label: t('smart.file.storage.title.bucketName'),
      show: ({ model }) => {
        return model.storageType === 'MINIO';
      },
      required: ({ model }) => model.storageType === 'MINIO',
    },
    // ------------- sftp
    {
      field: 'storageConfig.SFTP.host',
      component: 'Input',
      label: t('smart.file.storage.title.host'),
      show: ({ model }) => {
        return model.storageType === 'SFTP';
      },
      required: ({ model }) => model.storageType === 'SFTP',
    },
    {
      field: 'storageConfig.SFTP.port',
      component: 'InputNumber',
      label: t('smart.file.storage.title.port'),
      show: ({ model }) => {
        return model.storageType === 'SFTP';
      },
      required: ({ model }) => model.storageType === 'SFTP',
    },
    {
      field: 'storageConfig.SFTP.basePath',
      component: 'Input',
      label: t('smart.file.storage.title.basePath'),
      show: ({ model }) => {
        return model.storageType === 'SFTP';
      },
      required: ({ model }) => model.storageType === 'SFTP',
    },
    {
      field: 'storageConfig.SFTP.username',
      component: 'Input',
      label: t('smart.file.storage.title.username'),
      show: ({ model }) => {
        return model.storageType === 'SFTP';
      },
      required: ({ model }) => model.storageType === 'SFTP',
    },
    {
      field: 'storageConfig.SFTP.password',
      component: 'Input',
      label: t('smart.file.storage.title.password'),
      show: ({ model }) => {
        return model.storageType === 'SFTP';
      },
      required: ({ model }) => model.storageType === 'SFTP',
    },
    {
      field: 'storageConfig.SFTP.privateKey',
      component: 'Input',
      label: t('smart.file.storage.title.privateKey'),
      show: ({ model }) => {
        return model.storageType === 'SFTP';
      },
    },
    // --------------- 阿里云OSS
    ...getAliyunOssFormSchemas(t),
    // --------------- 七牛云
    ...getQiniuFormSchemas(t),
    ...getFtpFormSchemas(t),
  ];
};

export const getSearchFormSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      field: 'storageCode',
      label: t('smart.file.storage.title.storageCode'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      field: 'storageName',
      label: t('smart.file.storage.title.storageName'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      field: 'storageType',
      label: t('smart.file.storage.title.storageType'),
      component: 'SmartApiSelectDict',
      componentProps: {
        dictCode: 'FILE_STORAGE_TYPE',
        style: { width: '140px' },
      },
      searchSymbol: '=',
    },
  ];
};

/**
 * 获取阿里云OSS表单配置
 * @param t
 */
const getAliyunOssFormSchemas = (t: Function): FormSchema[] => {
  return [
    {
      field: 'storageConfig.ALIYUN_OSS.endpoint',
      component: 'Input',
      label: t('smart.file.storage.title.endpoint'),
      show: ({ model }) => {
        return model.storageType === 'ALIYUN_OSS';
      },
      required: ({ model }) => model.storageType === 'ALIYUN_OSS',
    },
    {
      field: 'storageConfig.ALIYUN_OSS.accessKey',
      component: 'Input',
      label: t('smart.file.storage.title.accessKey'),
      show: ({ model }) => {
        return model.storageType === 'ALIYUN_OSS';
      },
      required: ({ model }) => model.storageType === 'ALIYUN_OSS',
    },
    {
      field: 'storageConfig.ALIYUN_OSS.secretKey',
      component: 'Input',
      label: t('smart.file.storage.title.secretKey'),
      show: ({ model }) => {
        return model.storageType === 'ALIYUN_OSS';
      },
      required: ({ model }) => model.storageType === 'ALIYUN_OSS',
    },
    {
      field: 'storageConfig.ALIYUN_OSS.bucketName',
      component: 'Input',
      label: t('smart.file.storage.title.bucketName'),
      show: ({ model }) => {
        return model.storageType === 'ALIYUN_OSS';
      },
      required: ({ model }) => model.storageType === 'ALIYUN_OSS',
    },
  ];
};

const getQiniuFormSchemas = (t: Function): FormSchema[] => {
  return [
    {
      field: 'storageConfig.QINIU.accessKey',
      component: 'Input',
      label: t('smart.file.storage.title.accessKey'),
      show: ({ model }) => {
        return model.storageType === 'QINIU';
      },
      required: ({ model }) => model.storageType === 'QINIU',
    },
    {
      field: 'storageConfig.QINIU.secretKey',
      component: 'InputPassword',
      label: t('smart.file.storage.title.secretKey'),
      show: ({ model }) => {
        return model.storageType === 'QINIU';
      },
      required: ({ model }) => model.storageType === 'QINIU',
    },
    {
      field: 'storageConfig.QINIU.bucketName',
      component: 'Input',
      label: t('smart.file.storage.title.bucketName'),
      show: ({ model }) => {
        return model.storageType === 'QINIU';
      },
      required: ({ model }) => model.storageType === 'QINIU',
    },
    {
      field: 'storageConfig.QINIU.region',
      component: 'Input',
      label: t('smart.file.storage.title.region'),
      show: ({ model }) => {
        return model.storageType === 'QINIU';
      },
    },
    {
      field: 'storageConfig.QINIU.url',
      component: 'Input',
      label: t('smart.file.storage.title.url'),
      show: ({ model }) => {
        return model.storageType === 'QINIU';
      },
      required: ({ model }) => model.storageType === 'QINIU',
    },
    {
      field: 'storageConfig.QINIU.useHttps',
      component: 'Switch',
      label: t('smart.file.storage.title.useHttps'),
      show: ({ model }) => {
        return model.storageType === 'QINIU';
      },
    },
  ];
};

const getFtpFormSchemas = (t: Function): FormSchema[] => {
  return [
    {
      field: 'storageConfig.FTP.host',
      component: 'Input',
      label: t('smart.file.storage.title.host'),
      show: ({ model }) => {
        return model.storageType === 'FTP';
      },
      required: ({ model }) => model.storageType === 'FTP',
    },
    {
      field: 'storageConfig.FTP.port',
      component: 'InputNumber',
      label: t('smart.file.storage.title.port'),
      show: ({ model }) => {
        return model.storageType === 'FTP';
      },
      required: ({ model }) => model.storageType === 'FTP',
    },
    {
      field: 'storageConfig.FTP.basePath',
      component: 'Input',
      label: t('smart.file.storage.title.basePath'),
      show: ({ model }) => {
        return model.storageType === 'FTP';
      },
      required: ({ model }) => model.storageType === 'FTP',
    },
    {
      field: 'storageConfig.FTP.username',
      component: 'Input',
      label: t('smart.file.storage.title.username'),
      show: ({ model }) => {
        return model.storageType === 'FTP';
      },
      required: ({ model }) => model.storageType === 'FTP',
    },
    {
      field: 'storageConfig.FTP.password',
      component: 'Input',
      label: t('smart.file.storage.title.password'),
      show: ({ model }) => {
        return model.storageType === 'FTP';
      },
      required: ({ model }) => model.storageType === 'FTP',
    },
  ];
};
