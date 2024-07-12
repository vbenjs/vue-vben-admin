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
    title: `${t('pay.order.column.payId')}`,
    dataIndex: 'payId',
    sorter: true,
  },
  {
    title: `${t('pay.order.column.orderNo')}`,
    dataIndex: 'orderNo',
    sorter: true,
  },
  {
    title: `${t('pay.order.column.thirdOrderNo')}`,
    dataIndex: 'thirdOrderNo',
    sorter: true,
  },
  {
    title: `${t('pay.order.column.money')}`,
    dataIndex: 'money',
    sorter: true,
  },
  {
    title: `${t('pay.order.column.realityMoney')}`,
    dataIndex: 'realityMoney',
    sorter: true,
  },
  {
    title: `${t('pay.order.column.type')}`,
    dataIndex: 'type',
    sorter: true,
  },
  {
    title: `${t('pay.order.column.closeDate')}`,
    dataIndex: 'closeDate',
    sorter: true,
  },
  {
    title: `${t('pay.order.column.orderStatus')}`,
    dataIndex: 'orderStatus',
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
    field: 'title',
    label: `${t('pay.order.column.orderNo')}`,
    component: 'Input',
    colProps: { span: 8 },
  },

  {
    field: 'type',
    label: `${t('pay.order.column.type')}`,
    component: 'Input',
    colProps: { span: 8 },
  },

  {
    field: 'payId',
    label: `${t('pay.order.column.payId')}`,
    component: 'Input',
    colProps: { span: 8 },
  },

  {
    field: 'thirdOrderNo',
    label: `${t('pay.order.column.thirdOrderNo')}`,
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
