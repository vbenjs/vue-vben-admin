<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { message, TypographyParagraph } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import { recalculateOrderCosts } from '#/api';
import { RecalculateCostsType } from '#/constants';

function onSubmit(values: Record<string, any>) {
  modalApi.lock();

  recalculateOrderCosts(values)
    .then(() => {
      message.success(
        'Your request has been submitted successfully. Once the job is completed, the system will send a notification.',
        5,
      );
      modalApi.setData({ reload: true });
      modalApi.close();
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
      component: 'RangePicker',
      componentProps: {
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
      defaultValue: [dayjs().subtract(30, 'days'), dayjs()],
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
            value: RecalculateCostsType.COSG_HANDLING_FEES,
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
