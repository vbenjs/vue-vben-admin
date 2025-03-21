<script lang="ts" setup>
import { h, markRaw, reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
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
  showDefaultActions: false,
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
      component: 'Checkbox' as any,
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
    confirm-text="Add"
    :title="state.deleteMode ? 'Remove products' : 'Add products'"
    :show-confirm-button="!state.deleteMode"
    :close-on-click-modal="false"
  >
    <template #prepend-footer>
      <div class="flex-auto">
        <Button
          v-if="state.deleteMode"
          type="primary"
          danger
          @click="modalApi.onConfirm"
        >
          Remove
        </Button>
      </div>
    </template>

    <Form />
  </Modal>
</template>
