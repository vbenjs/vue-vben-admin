<script lang="ts" setup>
import { markRaw } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message, TypographyParagraph } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { orderSyncManually } from '#/api';
import { StateStatus } from '#/shared/constants';
import dayjs from '#/shared/dayjs';
import { getDatePreset } from '#/shared/utils';
import { useSystemStatisticStore } from '#/store';
import DateRangePicker from '#/views/shared-components/date-range-picker.vue';

const systemStatisticStore = useSystemStatisticStore();

function onSubmit(values: Record<string, any>) {
  modalApi.lock();

  orderSyncManually(values)
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
  <Modal class="w-[700px]" title="Sync Shopify Manually" confirm-text="Submit">
    <Form />

    <TypographyParagraph class="mt-5 px-5 italic">
      <span class="font-semibold">Note:</span> All orders are automatically
      synced to the app. If you still wish to sync manually, please use this
      form.
    </TypographyParagraph>
  </Modal>
</template>
