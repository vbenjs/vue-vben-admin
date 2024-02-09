import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';

import { getMessageTypeEnum, getMessagePriorityEnum } from '../../SmartMessageConstants';

export const getTableColumns = (t: Function): SmartColumn[] => {
  const messageTypeEnum = getMessageTypeEnum(t);
  const messagePriorityEnum = getMessagePriorityEnum(t);
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
      minWidth: 200,
      fixed: 'left',
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
      field: 'sendUserName',
      title: '{smart.message.smartMyMessage.title.sendUserName}',
      width: 120,
    },
    {
      field: 'sendTime',
      title: '{smart.message.smartMyMessage.title.sendTime}',
      width: 165,
      sortable: true,
    },
    {
      field: 'priority',
      title: '{smart.message.systemMessage.title.priority}',
      width: 120,
      sortable: true,
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
      field: 'readYn',
      title: '{smart.message.smartMyMessage.title.readYn}',
      width: 100,
      autoClass: 'Boolean',
      formatter: ({ row }) => {
        return row.readYn === true ? t('common.form.yes') : t('common.form.no');
      },
      sortable: true,
    },
    {
      field: 'readTime',
      title: '{smart.message.smartMyMessage.title.readTime}',
      width: 165,
      sortable: true,
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

export const getSearchFormSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      field: 'title',
      label: t('smart.message.systemMessage.title.title'),
      component: 'Input',
    },
    {
      field: 'readYn',
      label: t('smart.message.smartMyMessage.title.readYn'),
      component: 'Select',
      searchSymbol: '=',
      componentProps: {
        style: {
          width: '100px',
        },
        options: [
          {
            label: t('common.form.yes'),
            value: 1,
          },
          {
            label: t('common.form.no'),
            value: 0,
          },
        ],
      },
    },
  ];
};
