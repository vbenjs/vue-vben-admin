import type { VbenFormProps } from '#/adapter/form';

import dayjs from 'dayjs';

import { dateRangePresets, orderStatusList } from '#/constants';

export const formOptions: VbenFormProps = {
  collapsed: false,
  fieldMappingTime: [['date', ['from', 'to']]],
  schema: [
    {
      component: 'RangePicker',
      componentProps: {
        presets: dateRangePresets,
      },
      defaultValue: [dayjs().subtract(30, 'days'), dayjs()],
      fieldName: 'date',
      label: 'Date',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        mode: 'multiple',
        options: orderStatusList,
        placeholder: 'Payment status',
      },
      fieldName: 'financialStatus',
      label: 'Status',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: 'Order ID',
      componentProps: {
        placeholder: ' ',
      },
    },
  ],
  showCollapseButton: true,
  submitOnChange: true,
  submitOnEnter: false,
  showDefaultActions: false,
};
