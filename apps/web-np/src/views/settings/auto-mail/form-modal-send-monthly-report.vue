<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { message, TypographyParagraph } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { shopMailReport } from '#/api';

const userStore = useUserStore();

function onSubmit(values: Record<string, any>) {
  modalApi.lock();

  values.type = 'monthly';

  shopMailReport(values)
    .then(() => {
      message.success('The report has been sent. Please check your email.');
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
      componentProps: {
        picker: 'month',
      },
      fieldName: 'duration',
      label: 'Month',
      rules: 'required',
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      // Set value
      formApi.setValues({
        email: userStore.userInfo?.email,
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
  <Modal class="w-[700px]" title="Monthly Report" confirm-text="Send">
    <Form />

    <TypographyParagraph class="mt-2 px-5 italic">
      <!-- Consider - Check - Validate your email - double spam mail -->
      <span class="font-semibold">Note:</span> Please ensure that the email
      address is correct to avoid sending
      <span class="font-semibold">spam or duplicate emails</span>.
    </TypographyParagraph>
  </Modal>
</template>
