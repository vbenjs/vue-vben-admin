import type { VbenFormProps } from '#/adapter/form';

import dayjs from 'dayjs';

import { orderStatusList } from '#/constants';
import { getDatePreset } from '#/utils';

export const formOptions: VbenFormProps = {
  collapsed: false,
  fieldMappingTime: [['date', ['from', 'to']]],
  schema: [
    {
      component: 'RangePicker',
      componentProps: {
        presets: getDatePreset(
          [
            'today',
            'last7Days',
            'last14Days',
            'last30Days',
            'last90Days',
            'lastYear',
            'thisMonth',
            'thisYear',
          ],
          true,
        ),
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
