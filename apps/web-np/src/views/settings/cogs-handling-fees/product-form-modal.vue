<script lang="ts" setup>
import { h, markRaw, reactive } from 'vue';

import { useVbenForm, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { updateRegionProducts } from '#/api';
import { useShopSettingStore } from '#/store';

import Products from './modules/products.vue';

const shopSettingStore = useShopSettingStore();
const state = reactive({
  deleteMode: false,
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
      component: 'Input',
      dependencies: {
        show: false,
        triggerFields: ['deleteMode'],
      },
      fieldName: 'deleteMode',
    },
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
        show(values) {
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
      const { zoneUUID, deleteMode } = modalApi.getData<any>();

      if (!zoneUUID) {
        return;
      }

      state.deleteMode = deleteMode;
      state.zoneUUID = zoneUUID;
      state.zoneName = shopSettingStore.getZoneName(zoneUUID);
      formApi.setValues({
        deleteMode,
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
    :title="state.deleteMode ? 'Remove products' : 'Add products'"
    :confirm-text="state.deleteMode ? 'Remove' : 'Add'"
    :close-on-click-modal="false"
  >
    <Form />
  </Modal>
</template>
