<script lang="ts" setup>
import type { IRegion } from '#/store';

import { markRaw } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { ShippingCostLevel } from '#/shared/constants';
import { useShopSettingStore, useShopStore } from '#/store';

import Countries from './modules/countries.vue';

const shopStore = useShopStore();
const shopSettingStore = useShopSettingStore();

function onSubmit(values: Record<string, any>) {
  modalApi.lock();

  shopSettingStore
    .setRegion(values)
    .then(() => {
      message.success('The zone has been updated successfully');
    })
    .finally(() => {
      modalApi.setData({ reload: true });
      modalApi.close();
    });
}

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
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
        triggerFields: ['uuid'],
      },
      fieldName: 'uuid',
      label: 'uuid',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: 'Name',
      rules: 'required',
      dependencies: {
        if(values) {
          return values.uuid !== 'default';
        },
        triggerFields: ['uuid'],
      },
    },
    {
      component: 'Select' as any,
      defaultValue: ShippingCostLevel.WEIGHT,
      componentProps: {
        options: [
          { label: 'Weight', value: ShippingCostLevel.WEIGHT },
          { label: 'Quantity', value: ShippingCostLevel.QUANTITY },
        ],
      },
      fieldName: 'shippingCostLevel',
      label: 'Shipping cost by',
      rules: 'required',
    },
    {
      component: 'InputNumber' as any,
      defaultValue: 0,
      componentProps: {
        prefix: shopStore.shop.currencySymbol,
        addonAfter: shopStore.shop.currency,
        min: 0,
      },
      fieldName: 'shippingCostPrice',
      label: 'Shipping cost',
      rules: 'required',
    },
    {
      component: markRaw(Countries),
      defaultValue: [],
      fieldName: 'countries',
      label: 'Countries',
      rules: 'required',
      dependencies: {
        if(values) {
          return values.uuid !== 'default';
        },
        triggerFields: ['uuid'],
      },
    },
  ],
  showDefaultActions: false,
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
      const values = modalApi.getData<IRegion>();

      if (!values) {
        return;
      }

      formApi.setValues(values);
    }
  },
});
</script>
<template>
  <Modal class="w-[700px]" title="Zone - Shipping Cost " confirm-text="Submit">
    <Form />
  </Modal>
</template>
