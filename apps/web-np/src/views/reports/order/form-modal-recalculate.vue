<script lang="ts" setup>
import { markRaw } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message, TypographyParagraph } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { orderRecalculateCosts } from '#/api';
import { RecalculateCostsType, StateStatus } from '#/shared/constants';
import dayjs from '#/shared/dayjs';
import { getDatePreset } from '#/shared/utils';
import { useSystemStatisticStore } from '#/store';
import DateRangePicker from '#/views/shared-components/date-range-picker.vue';

const systemStatisticStore = useSystemStatisticStore();

function onSubmit(values: Record<string, any>) {
  modalApi.lock();

  orderRecalculateCosts(values)
    .then(() => {
      message.success(
        'Your request has been submitted successfully. Once the job is completed, the system will send a notification.',
        5,
      );
      modalApi.setData({ reload: true });
      modalApi.close();

      systemStatisticStore.setCalcOrder(StateStatus.PROCESSING);
    })
    .finally(() => {
      modalApi.lock(false);
    });
}

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  showDefaultActions: false,
  commonConfig: {
    colon: true,
    componentProps: {
      class: 'w-full',
    },
    labelClass: 'w-1/4',
  },
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
            'last2Months',
            'last3Months',
            'last6Months',
            'lastYear',
            'thisYear',
          ],
          true,
        ),
      },
      defaultValue: [dayjs().add(-1, 'month').add(1, 'day'), dayjs()],
      fieldName: 'date',
      label: 'Date',
      rules: 'required',
    },
    {
      component: 'CheckboxGroup',
      componentProps: {
        name: 'costTypes',
        options: [
          {
            label: 'COGS - Handling fees',
            value: RecalculateCostsType.COGS_HANDLING_FEES,
          },
          {
            label: 'Shipping cost',
            value: RecalculateCostsType.SHIPPING_COSTS,
          },
          {
            label: 'Transaction fees',
            value: RecalculateCostsType.TRANSACTION_FEES,
          },
        ],
      },
      fieldName: 'costTypes',
      label: 'Costs',
      rules: 'required',
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
  },
});
</script>
<template>
  <Modal class="w-[700px]" title="Recalculate Costs" confirm-text="Submit">
    <Form />

    <TypographyParagraph class="mt-5 px-5 italic">
      <span class="font-semibold">Note:</span> After submitting the
      recalculation request, the system will schedule the recalculation of all
      related costs. Once the job is completed, the system will send a
      notification.
    </TypographyParagraph>
  </Modal>
</template>
