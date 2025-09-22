import type { VbenFormProps } from '#/adapter/form';

import { markRaw } from 'vue';

import { orderStatusList } from '#/shared/constants';
import { dayjsInGMT } from '#/shared/dayjs';
import { getDatePreset } from '#/shared/utils';
import { useShopStore } from '#/store';
import DateRangePicker from '#/views/shared-components/date-range-picker.vue';

const shopStore = useShopStore();

export const formOptions: VbenFormProps = {
  collapsed: false,
  fieldMappingTime: [['date', ['from', 'to'], 'YYYY-MM-DDTHH:mm:ssZ']],
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
        disabled: shopStore.isFreeSubscription,
      },
      defaultValue: [dayjsInGMT().add(-1, 'month').add(1, 'day'), dayjsInGMT()],
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
        disabled: shopStore.isFreeSubscription,
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
        disabled: shopStore.isFreeSubscription,
      },
    },
  ],
  showCollapseButton: true,
  submitOnChange: true,
  submitOnEnter: false,
  showDefaultActions: false,
};
