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
      field: 'channelCode',
      fixed: 'left',
      title: '{smart.sms.channel.title.channelCode}',
      width: 160,
    },
    {
      field: 'channelName',
      fixed: 'left',
      title: '{smart.sms.channel.title.channelName}',
      width: 160,
    },
    {
      field: 'channelType',
      sortable: true,
      title: '{smart.sms.channel.title.channelType}',
      width: 120,
    },
    {
      field: 'isDefault',
      title: '{smart.sms.channel.title.isDefault}',
      component: 'booleanTag',
      width: 120,
    },
    {
      field: 'channelProperties',
      visible: false,
      title: '{smart.sms.channel.title.channelProperties}',
      width: 120,
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
      field: 'createTime',
      sortable: true,
      title: '{common.table.createTime}',
      width: 170,
    },
    {
      field: 'createBy',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'updateTime',
      sortable: true,
      title: '{common.table.updateTime}',
      width: 170,
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
    {
      ...tableUseYnClass(),
    },
    {
      title: '{common.table.operation}',
      field: 'operation',
      width: 200,
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
      label: '',
      component: 'Input',
      componentProps: {},
      show: false,
    },
    {
      field: 'channelCode',
      label: t('smart.sms.channel.title.channelCode'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'channelName',
      label: t('smart.sms.channel.title.channelName'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'channelType',
      label: t('smart.sms.channel.title.channelType'),
      component: 'SmartApiSelectDict',
      componentProps: {
        dictCode: 'SMART_SMS_CHANNEL',
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
      field: 'remark',
      label: t('common.table.remark'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'useYn',
      label: t('common.table.useYn'),
      component: 'Switch',
      componentProps: {},
      defaultValue: true,
    },
    ...getAliyunFormSchemas(),
    ...getTencentFormSchemas(),
  ];
};

export const getSearchFormSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      field: 'channelCode',
      label: t('smart.sms.channel.title.channelCode'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      field: 'channelName',
      label: t('smart.sms.channel.title.channelName'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      field: 'channelType',
      label: t('smart.sms.channel.title.channelType'),
      searchSymbol: '=',
      component: 'SmartApiSelectDict',
      componentProps: {
        dictCode: 'SMART_SMS_CHANNEL',
        style: {
          width: '120px',
        },
      },
    },
  ];
};

const getAliyunFormSchemas = (): FormSchema[] => {
  return [
    {
      field: 'channelProperties.ALIYUN.accessKey',
      component: 'Input',
      label: 'accessKey',
      required: ({ model }) => model.channelType === 'ALIYUN',
      show: ({ model }) => {
        return model.channelType === 'ALIYUN';
      },
    },
    {
      field: 'channelProperties.ALIYUN.accessSecret',
      component: 'Input',
      label: 'accessSecret',
      required: ({ model }) => model.channelType === 'ALIYUN',
      show: ({ model }) => {
        return model.channelType === 'ALIYUN';
      },
    },
    {
      field: 'channelProperties.ALIYUN.endpoint',
      component: 'SmartApiSelectDict',
      componentProps: {
        dictCode: 'SMART_SMS_ALIYUN_ENDPOINT',
      },
      label: 'endpoint',
      required: ({ model }) => model.channelType === 'ALIYUN',
      show: ({ model }) => {
        return model.channelType === 'ALIYUN';
      },
    },
  ];
};

const getTencentFormSchemas = (): FormSchema[] => {
  return [
    {
      field: 'channelProperties.TENCENT.accessKey',
      component: 'Input',
      label: 'accessKey',
      required: ({ model }) => model.channelType === 'TENCENT',
      show: ({ model }) => {
        return model.channelType === 'TENCENT';
      },
    },
    {
      field: 'channelProperties.TENCENT.accessSecret',
      component: 'Input',
      label: 'accessSecret',
      required: ({ model }) => model.channelType === 'TENCENT',
      show: ({ model }) => {
        return model.channelType === 'TENCENT';
      },
    },
    {
      field: 'channelProperties.TENCENT.appid',
      component: 'Input',
      label: 'appid',
      required: ({ model }) => model.channelType === 'TENCENT',
      show: ({ model }) => {
        return model.channelType === 'TENCENT';
      },
    },
    {
      field: 'channelProperties.TENCENT.region',
      component: 'SmartApiSelectDict',
      componentProps: {
        dictCode: 'SMART_SMS_TENCENT_REGION',
      },
      label: 'Region',
      required: ({ model }) => model.channelType === 'TENCENT',
      show: ({ model }) => {
        return model.channelType === 'TENCENT';
      },
    },
  ];
};
