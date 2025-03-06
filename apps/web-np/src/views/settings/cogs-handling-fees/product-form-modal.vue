<script lang="ts" setup>
import { h, markRaw, reactive } from 'vue';

import { useVbenForm, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { updateRegionProducts } from '#/api';
import { useShopSettingStore } from '#/store';

import Products from './modules/products.vue';

const shopSettingStore = useShopSettingStore();
const state = reactive({
  zoneUUID: '',
  zoneName: '',
});

function onSubmit(values: Record<string, any>) {
  modalApi.lock();

  updateRegionProducts(values)
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
    labelClass: 'w-1/6',
  },
  schema: [
    {
      component: h('span'),
      renderComponentContent: () => {
        return {
          default: () => state.zoneName,
        };
      },
      fieldName: 'zoneUUID',
      label: 'Zone name',
    },
    {
      component: 'Checkbox',
      fieldName: 'allProducts',
      label: 'Products',
      renderComponentContent: () => {
        return {
          default: () => ['All products'],
        };
      },
    },
    {
      component: markRaw(Products),
      defaultValue: [],
      fieldName: 'zoneProducts',
      label: '',
      rules: 'required',
      dependencies: {
        if(values) {
          return !values.allProducts;
        },
        triggerFields: ['allProducts'],
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
      const { zoneUUID } = modalApi.getData<any>();

      if (!zoneUUID) {
        return;
      }

      state.zoneUUID = zoneUUID;
      state.zoneName = shopSettingStore.getZoneName(zoneUUID);
      formApi.setValues({
        zoneUUID,
        zoneProducts: [],
      });
    }
  },
});
</script>
<template>
  <Modal
    class="w-[700px]"
    title="Alter the product list "
    confirm-text="Submit"
  >
    <Form />
  </Modal>
</template>
