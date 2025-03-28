<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { Button, message, TypographyParagraph } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import { recalculateOrderCosts } from '#/api';
import { dateRangePresets, RecalculateCostsType } from '#/constants';
import { router } from '#/router';

function onSubmit(values: Record<string, any>) {
  modalApi.lock();

  recalculateOrderCosts({
    ...values,
    costTypes: [RecalculateCostsType.TRANSACTION_FEES],
  })
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
    labelClass: 'w-1/6',
  },
  fieldMappingTime: [['date', ['from', 'to']]],
  schema: [
    {
      component: 'RangePicker' as any,
      componentProps: {
        presets: dateRangePresets,
      },
      defaultValue: [dayjs().subtract(30, 'days'), dayjs()],
      fieldName: 'date',
      label: 'Date',
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

const redirectToOrderReport = () => {
  modalApi.close();
  router.push({ name: 'reports.order' });
};
</script>
<template>
  <Modal
    class="w-[700px]"
    title="Recalculate Transaction Fees"
    confirm-text="Submit"
  >
    <template #prepend-footer>
      <div class="flex-auto">
        <Button size="small" type="dashed" @click="redirectToOrderReport">
          Go to Order Report
        </Button>
      </div>
    </template>
    <Form />

    <TypographyParagraph class="mt-5 px-5 italic">
      <span class="font-semibold">Note:</span> After submitting the
      recalculation request, the system will schedule the recalculation of all
      related costs. Once the job is completed, the system will send a
      notification.
    </TypographyParagraph>

    <TypographyParagraph class="mt-5 px-5 italic">
      To review the result, please go to the
      <span class="font-semibold">Order Report</span> page.
    </TypographyParagraph>
  </Modal>
</template>
