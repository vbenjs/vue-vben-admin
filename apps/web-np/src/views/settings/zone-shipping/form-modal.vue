<script lang="ts" setup>
import type { IRegion } from '#/store';

import { markRaw } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message, TypographyParagraph } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { ShippingCostLevel, ShippingCostLevelList } from '#/shared/constants';
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
        options: ShippingCostLevelList,
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
    <TypographyParagraph class="mt-5 px-5 italic">
      <span class="font-semibold">Example:</span>
      Order A has <span class="font-semibold">2 items</span> with a total weight
      of <span class="font-semibold">1.5kg</span>
      <div
        v-if="
          formApi.form.values.shippingCostLevel === ShippingCostLevel.WEIGHT
        "
        class="ml-10"
      >
        If the cost is set to
        <span class="font-semibold">$5 for every 1kg (weight)</span>, the total
        shipping cost for Order A will be
        <span class="font-semibold">$7.5</span> (1.5 x $5)
      </div>
      <div
        v-if="
          formApi.form.values.shippingCostLevel === ShippingCostLevel.QUANTITY
        "
        class="ml-10"
      >
        If the cost is set to
        <span class="font-semibold">$3 for every 1 item (quantity)</span>, the
        total shipping cost for Order A will be
        <span class="font-semibold">$6</span> (2 x $3)
      </div>
      <div
        v-if="formApi.form.values.shippingCostLevel === ShippingCostLevel.ORDER"
        class="ml-10"
      >
        If the cost is set to
        <span class="font-semibold">$1 for every 1 order</span>, the total
        shipping cost for Order A will be
        <span class="font-semibold">$1</span>
      </div>
    </TypographyParagraph>
  </Modal>
</template>
