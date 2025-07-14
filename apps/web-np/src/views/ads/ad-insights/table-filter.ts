import type { VbenFormProps } from '@vben/common-ui';

import { markRaw } from 'vue';

import dayjs from '#/shared/dayjs';
import { getDatePreset } from '#/shared/utils';
import DateRangePicker from '#/views/shared-components/date-range-picker.vue';

export const formOptions: VbenFormProps = {
  commonConfig: {
    colon: true,
    componentProps: {
      class: 'w-full',
    },
    labelClass: 'w-2/6',
  },
  fieldMappingTime: [['date', ['fromDate', 'toDate']]],
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
            'last2Months',
            'last3Months',
            'previousMonth',
            'thisMonth',
          ],
          true,
        ),
      },
      defaultValue: [dayjs().add(-1, 'month').add(1, 'day'), dayjs()],
      fieldName: 'date',
      label: 'Date',
    },
    {
      component: 'Input',
      fieldName: 'adName',
      label: 'Ad',
      componentProps: {
        placeholder: 'Search by Ad Name',
      },
    },
    {
      component: 'Input',
      fieldName: 'adGroupName',
      label: 'Group',
      componentProps: {
        placeholder: 'Search by Group Name',
      },
    },
    {
      component: 'Input',
      fieldName: 'adCampaignName',
      label: 'Campaign',
      componentProps: {
        placeholder: 'Search by Campaign Name',
      },
    },
    {
      component: 'Input',
      fieldName: 'adAccountName',
      label: 'Ad Account',
      componentProps: {
        placeholder: 'Search by Ad Account Name',
      },
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
  wrapperClass: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
};
