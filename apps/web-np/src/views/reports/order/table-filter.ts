import type { VbenFormProps } from '#/adapter/form';

import { markRaw } from 'vue';

import dayjs from 'dayjs';

import { orderStatusList } from '#/constants';
import { getDatePreset } from '#/utils';
import DateRangePicker from '#/views/shared-components/date-range-picker.vue';

export const formOptions: VbenFormProps = {
  collapsed: false,
  fieldMappingTime: [['date', ['from', 'to']]],
  schema: [
    {
      component: markRaw(DateRangePicker),
      componentProps: {
        picker: 'day',
        pickerLimitName: '1 year',
        presets: getDatePreset(
          [
            'today',
            'last7Days',
            'last14Days',
            'lastMonth',
            'lastYear',
            'previousMonth',
            'thisMonth',
            'thisYear',
          ],
          true,
        ),
      },
      defaultValue: [dayjs().subtract(1, 'month'), dayjs()],
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
