import type { VbenFormProps } from '@vben/common-ui';

import { getDatePreset } from '#/utils';

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
