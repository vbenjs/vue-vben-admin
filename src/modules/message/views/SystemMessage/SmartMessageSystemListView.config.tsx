import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';
import type { FormSchema } from '@/components/Form';

import { getMessageTypeEnum, getMessagePriorityEnum } from '../../SmartMessageConstants';

export const getMessageSendStatusEnum = (t: Function) => {
  return [
    {
      label: t('smart.message.systemMessage.form.sendStatus.NO_SEND'),
      value: 'NO_SEND',
    },
    {
      label: t('smart.message.systemMessage.form.sendStatus.SEND'),
      value: 'SEND',
    },
    {
      label: t('smart.message.systemMessage.form.sendStatus.CANCEL'),
      value: 'CANCEL',
    },
  ];
};

export const getReceiveUserTypeEnum = (t: Function) => {
  return [
    {
      label: t('smart.message.systemMessage.form.receiveUserType.ALL_USER'),
      value: 'ALL_USER',
    },
    {
      label: t('smart.message.systemMessage.form.receiveUserType.SPECIFY_USER'),
      value: 'SPECIFY_USER',
    },
    {
      label: t('smart.message.systemMessage.form.receiveUserType.BUSINESS_USER'),
      value: 'BUSINESS_USER',
    },
  ];
};

/**
 * 表格列表
 */
export const getTableColumns = (t: Function): SmartColumn[] => {
  const messageTypeEnum = getMessageTypeEnum(t);
  const sendStatusEnum = getMessageSendStatusEnum(t);
  const messagePriorityEnum = getMessagePriorityEnum(t);
  const receiveUserTypeEnum = getReceiveUserTypeEnum(t);
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'title',
      title: '{smart.message.systemMessage.title.title}',
      width: 200,
      fixed: 'left',
    },
    {
      field: 'abstractContent',
      title: '{smart.message.systemMessage.title.abstract}',
      width: 120,
    },
    {
      field: 'messageType',
      title: '{smart.message.systemMessage.title.messageType}',
      width: 120,
      dynamicClass: ({ row }) => {
        const messageType = row.messageType;
        if (!messageType) {
          return '';
        }
        return messageType === 'ANNOUNCEMENT'
          ? 'text-color--success-bold'
          : 'text-color--link-bold';
      },
      formatter: ({ row }) => {
        const messageType = row.messageType;
        if (!messageType) {
          return '';
        }
        const enumList = messageTypeEnum.filter((item) => item.value === row.messageType);
        if (enumList.length === 0) {
          return '';
        }
        const data = enumList[0];
        return data.label;
      },
    },
    {
      field: 'sendStatus',
      title: '{smart.message.systemMessage.title.sendStatus}',
      width: 120,
      slots: {
        default: ({ row }) => {
          if (!row.sendStatus) {
            return '';
          }
          const enumList = sendStatusEnum.filter((item) => item.value === row.sendStatus);
          if (enumList.length === 0) {
            return '';
          }
          const data = enumList[0];
          let color = 'pink';
          if (data.value === 'SEND') {
            color = 'green';
          } else if (data.value === 'CANCEL') {
            color = 'grey';
          }
          return <a-tag color={color}>{data.label}</a-tag>;
        },
      },
    },
    {
      field: 'priority',
      title: '{smart.message.systemMessage.title.priority}',
      width: 120,
      slots: {
        default: ({ row }) => {
          if (!row.priority) {
            return '';
          }
          const enumList = messagePriorityEnum.filter((item) => item.value === row.priority);
          if (enumList.length === 0) {
            return '';
          }
          const data = enumList[0];
          let color = 'pink';
          if (data.value === 'MIDDLE') {
            color = 'orange';
          } else if (data.value === 'LOW') {
            color = 'green';
          }
          return <a-tag color={color}>{data.label}</a-tag>;
        },
      },
    },
    {
      field: 'receiveUserType',
      title: '{smart.message.systemMessage.title.receiveUserType}',
      width: 120,
      slots: {
        default: ({ row }) => {
          if (!row.receiveUserType) {
            return '';
          }
          const enumList = receiveUserTypeEnum.filter((item) => item.value === row.receiveUserType);
          if (enumList.length === 0) {
            return '';
          }
          const data = enumList[0];
          let color = '#2db7f5';
          if (data.value === 'SPECIFY_USER') {
            color = '#87d068';
          } else if (data.value === 'BUSINESS_USER') {
            color = '#108ee9';
          }
          return <a-tag color={color}>{data.label}</a-tag>;
        },
      },
    },
    {
      field: 'sendTime',
      title: '{smart.message.systemMessage.title.sendTime}',
      width: 165,
      sortable: true,
    },
    {
      field: 'cancelTime',
      title: '{smart.message.systemMessage.title.cancelTime}',
      width: 165,
      sortable: true,
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
      width: 170,
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
      width: 170,
      sortable: true,
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
      label: t('smart.message.systemMessage.title.id'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'messageType',
      label: t('smart.message.systemMessage.title.messageType'),
      component: 'RadioGroup',
      componentProps: {
        options: getMessageTypeEnum(t),
      },
      defaultValue: 'ANNOUNCEMENT',
    },
    {
      field: 'title',
      label: t('smart.message.systemMessage.title.title'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'abstractContent',
      label: t('smart.message.systemMessage.title.abstract'),
      component: 'InputTextArea',
      componentProps: {},
      required: true,
    },
    {
      field: 'priority',
      label: t('smart.message.systemMessage.title.priority'),
      component: 'RadioGroup',
      componentProps: {
        options: getMessagePriorityEnum(t),
      },
      defaultValue: 'H',
    },
    {
      field: 'receiveUserType',
      label: t('smart.message.systemMessage.title.receiveUserType'),
      component: 'RadioGroup',
      componentProps: {
        options: getReceiveUserTypeEnum(t),
      },
      defaultValue: 'ALL_USER',
    },
    {
      field: 'userIds',
      label: t('smart.message.systemMessage.title.userIds'),
      component: 'SmartUserTableSelect',
      show: ({ model }) => {
        return model.receiveUserType !== 'ALL_USER';
      },
      required: ({ model }) => {
        return model.receiveUserType !== 'ALL_USER';
      },
    },
    {
      field: 'useYn',
      label: t('common.table.useYn'),
      component: 'Switch',
      defaultValue: true,
      componentProps: {},
    },
    {
      field: 'content',
      label: t('smart.message.systemMessage.title.content'),
      slot: 'addEdit-content',
    },
  ];
};

export const getSearchFormSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      field: 'title',
      label: t('smart.message.systemMessage.title.title'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      field: 'messageType',
      label: t('smart.message.systemMessage.title.messageType'),
      component: 'Select',
      searchSymbol: '=',
      componentProps: {
        options: getMessageTypeEnum(t),
        style: {
          width: '140px',
        },
      },
    },
    {
      field: 'sendStatus',
      label: t('smart.message.systemMessage.title.sendStatus'),
      component: 'Select',
      searchSymbol: '=',
      componentProps: {
        options: getMessageSendStatusEnum(t),
        style: {
          width: '140px',
        },
      },
    },
    {
      field: 'priority',
      label: t('smart.message.systemMessage.title.priority'),
      component: 'Select',
      searchSymbol: '=',
      componentProps: {
        options: getMessagePriorityEnum(t),
        style: {
          width: '125px',
        },
      },
    },
    {
      field: 'receiveUserType',
      label: t('smart.message.systemMessage.title.receiveUserType'),
      component: 'Select',
      searchSymbol: '=',
      componentProps: {
        options: getReceiveUserTypeEnum(t),
        style: {
          width: '140px',
        },
      },
    },
  ];
};

export enum Auth {
  delete = 'smart:message:systemMessage:delete',
  update = 'smart:message:systemMessage:update',
  save = 'smart:message:systemMessage:save',
  publish = 'smart:message:systemMessage:publish',
  cancel = 'smart:message:systemMessage:cancel',
}
