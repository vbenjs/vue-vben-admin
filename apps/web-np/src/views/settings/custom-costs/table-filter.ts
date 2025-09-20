import type { VbenFormProps } from '@vben/common-ui';

import { markRaw } from 'vue';

import { getDatePreset } from '#/shared/utils';
import DateRangePicker from '#/views/shared-components/date-range-picker.vue';

import { customCostTypes } from './service';

export const formOptions: VbenFormProps = {
  fieldMappingTime: [['date', ['from', 'to'], 'YYYY-MM-DDTHH:mm:ssZ']],
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      label: 'Name',
      componentProps: {
        placeholder: 'Search by cost name',
      },
    },
    {
      component: markRaw(DateRangePicker),
      componentProps: {
        presets: getDatePreset(
          [
            'today',
            'last7Days',
            'last14Days',
            'lastMonth',
            'last3Months',
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
        placeholder: 'Select cost type',
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
  wrapperClass: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};
