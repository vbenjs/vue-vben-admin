import type { VbenFormProps } from '@vben/common-ui';

import dayjs from 'dayjs';

import { customCostTypes } from './service';

export const formOptions: VbenFormProps = {
  fieldMappingTime: [['date', ['from', 'to']]],
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      label: 'Name',
    },
    {
      component: 'RangePicker',
      componentProps: {
        // Show last week button
        presets: [
          { label: 'Today', value: [dayjs().add(-1, 'd'), dayjs()] },
          { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
          { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
          { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
          { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
          { label: 'Last year', value: [dayjs().add(-365, 'd'), dayjs()] },
          { label: 'Last 2 year', value: [dayjs().add(-730, 'd'), dayjs()] },
        ],
      },
      fieldName: 'date',
      label: 'Date',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        mode: 'multiple',
        options: customCostTypes,
      },
      fieldName: 'type',
      label: 'Type',
    },
  ],
  showCollapseButton: false,
  collapsed: true,
  submitOnChange: true,
  submitOnEnter: true,
  showDefaultActions: true,
  resetButtonOptions: {
    show: false,
  },
  submitButtonOptions: {
    show: false,
  },
  wrapperClass: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
};
