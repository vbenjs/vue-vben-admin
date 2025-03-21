<script lang="ts" setup>
import { useVbenForm, useVbenModal, z } from '@vben/common-ui';

// function onSubmit(values: Record<string, any>) {
//   modalApi.lock();

//   // console.log(values);

//   // if (values.type === CustomCostType.GROSS_SALE_PERCENTAGE) {
//   //   values.grossSaleRate = toRate(values.grossSaleRate);
//   // }

//   // if (values.endDate && !onGoingDate.diff(values.endDate)) {
//   //   values.endDate = null;
//   // }

//   // storeCustomCost(values)
//   //   .then(() => {
//   //     message.success('The custom cost has been saved successfully');
//   //     modalApi.setData({ reload: true });
//   //     modalApi.close();
//   //   })
//   //   .finally(() => {
//   //     modalApi.lock(false);
//   //   });
// }

// function onChanged(values: Record<string, any>) {
//   // console.log(values);
// }

const [Form, formApi] = useVbenForm({
  // handleSubmit: onSubmit,
  // handleValuesChange: onChanged,
  showDefaultActions: false,
  commonConfig: {
    colon: true,
    componentProps: {
      class: 'w-full',
    },
    labelClass: 'w-1/4',
  },
  schema: [
    {
      component: 'Input',
      dependencies: {
        show: false,
        triggerFields: ['id'],
      },
      fieldName: 'id',
      label: 'id',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: 'Name',
      dependencies: {
        if(values) {
          return values.uuid !== 'default';
        },
        triggerFields: ['uuid'],
      },
      rules: z.string().min(3),
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
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<any>();

      if (!values.name) {
        return;
      }

      formApi.setValues({
        ...values,
      });
    }
  },
});
</script>
<template>
  <Modal class="w-[700px]" title="Recalculate Costs" confirm-text="Submit">
    <Form />
  </Modal>
</template>
