import { Tag } from 'ant-design-vue';
import { BasicColumn } from '/@/components/Table/index';
import { ErrorTypeEnum } from '/@/enums/exceptionEnum';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n('sys.errorLog');

export function getColumns(): BasicColumn[] {
  return [
    {
      dataIndex: 'type',
      title: t('tableColumnType'),
      width: 80,
      customRender: ({ text }) => {
        const color =
          text === ErrorTypeEnum.VUE
            ? 'green'
            : text === ErrorTypeEnum.RESOURCE
            ? 'cyan'
            : text === ErrorTypeEnum.PROMISE
            ? 'blue'
            : ErrorTypeEnum.AJAX
            ? 'red'
            : 'purple';
        return <Tag color={color}>{() => text}</Tag>;
      },
    },
    {
      dataIndex: 'url',
      title: 'URL',
      width: 200,
    },
    {
      dataIndex: 'time',
      title: t('tableColumnDate'),
      width: 160,
    },
    {
      dataIndex: 'file',
      title: t('tableColumnFile'),
      width: 200,
    },
    {
      dataIndex: 'name',
      title: 'Name',
      width: 200,
    },
    {
      dataIndex: 'message',
      title: t('tableColumnMsg'),
      width: 300,
    },
    {
      dataIndex: 'stack',
      title: t('tableColumnStackMsg'),
      width: 300,
    },
  ];
}

export function getDescSchema() {
  return getColumns().map((column) => {
    return {
      field: column.dataIndex!,
      label: column.title,
    };
  });
}
