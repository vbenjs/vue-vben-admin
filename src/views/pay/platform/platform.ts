import { BasicColumn, FormSchema } from '@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { useI18n } from '@/hooks/web/useI18n';

const { t } = useI18n();

export const columns: BasicColumn[] = [
  {
    title: 'id',
    defaultHidden: true,
    dataIndex: 'id',
  },
  {
    title: `${t('pay.payPlatform.column.name')}`,
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: `${t('pay.payPlatform.column.appId')}`,
    dataIndex: 'appId',
    sorter: true,
  },

  {
    title: `${t('common.status')}`,
    dataIndex: 'status',
    width: 80,
    customRender: ({ record }) => {
      const status = record.status;
      const enable = ~~status === 1;
      const color = enable ? 'green' : 'red';
      const text = enable ? `${t('common.enable')}` : `${t('common.disable')}`;
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: `${t('common.create_time')}`,
    dataIndex: 'createTime',
    width: 200,
    sorter: true,
  },
  {
    title: `${t('common.updateTime')}`,
    dataIndex: 'updateTime',
    width: 200,
    sorter: true,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: `${t('pay.payPlatform.column.name')}`,
    component: 'Input',
    colProps: { span: 8 },
  },

  {
    field: 'status',
    label: `${t('common.status')}`,
    component: 'Select',
    colProps: { span: 8 },
    componentProps: {
      options: [
        { label: `${t('common.enable')}`, value: 1 },
        { label: `${t('common.disable')}`, value: 9 },
      ],
    },
  },
];
