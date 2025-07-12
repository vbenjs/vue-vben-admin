<script lang="ts" setup>
import { reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message, TypographyParagraph } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { shopSendWeeklyReport } from '#/api';

const state = reactive({
  shop: {} as any,
});

function onSubmit(values: Record<string, any>) {
  modalApi.lock();

  shopSendWeeklyReport(state.shop.id, values)
    .then(() => {
      message.success('The request has been submitted successfully.');
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
  },
  schema: [
    {
      component: 'Input',
      fieldName: 'email',
      label: 'Email',
      rules: 'required',
    },
    {
      component: 'DatePicker' as any,
      // componentProps: {
      //   disableDates: (date: Date) => {
      //     const today = new Date();
      //     return date.getDay() !== 1 || date > today; // Only allow Mondays and not future dates
      //   },
      // },
      fieldName: 'monday',
      label: 'Monday',
      rules: 'required',
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      state.shop = modalApi.getData().shop;

      // Set value
      formApi.setValues({
        email: state.shop.email || '',
      });
    }
  },
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
  },
});
</script>
<template>
  <Modal class="w-[700px]" title="Weekly Report" confirm-text="Send">
    <Form />

    <TypographyParagraph class="mt-5 px-5 italic">
      <span class="font-semibold">Note:</span> Send weekly report to shop owner
      via email. The email include the shop's performance data in 14 days.
    </TypographyParagraph>
  </Modal>
</template>
