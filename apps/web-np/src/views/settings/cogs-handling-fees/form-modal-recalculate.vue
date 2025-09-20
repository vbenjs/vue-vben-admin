<script lang="ts" setup>
import { markRaw } from 'vue';

import { useVbenModal, VbenButton } from '@vben/common-ui';

import { message, TypographyParagraph } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { orderRecalculateCosts } from '#/api';
import { RecalculateCostsType, StateStatus } from '#/shared/constants';
import { dayjsInGMT } from '#/shared/dayjs';
import { getDatePreset, redirect } from '#/shared/utils';
import { useSystemStatisticStore } from '#/store';
import DateRangePicker from '#/views/shared-components/date-range-picker.vue';

const systemStatisticStore = useSystemStatisticStore();

function onSubmit(values: Record<string, any>) {
  modalApi.lock();

  orderRecalculateCosts({
    ...values,
    costTypes: [RecalculateCostsType.COGS_HANDLING_FEES],
  })
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
    labelClass: 'w-1/6',
  },
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
            'last2Months',
            'last3Months',
            'last6Months',
            'lastYear',
            'thisYear',
          ],
          true,
        ),
      },
      defaultValue: [dayjsInGMT().add(-1, 'month').add(1, 'day'), dayjsInGMT()],
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
  redirect('reports-order');
};
</script>
<template>
  <Modal
    class="w-[700px]"
    title="Recalculate COGS - Handling Fees"
    confirm-text="Submit"
  >
    <template #prepend-footer>
      <div class="flex-auto">
        <VbenButton
          variant="link"
          size="xs"
          class="w-[110px]"
          @click="redirectToOrderReport()"
        >
          View order report
        </VbenButton>
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
