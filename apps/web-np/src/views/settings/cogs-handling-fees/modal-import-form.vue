<script lang="ts" setup>
import { h, markRaw, reactive } from 'vue';

import { useVbenForm, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { importCogsHandlingFees } from '#/api';
import { useShopSettingStore } from '#/store';

import UploadCmp from './modules/upload.vue';

const shopSettingStore = useShopSettingStore();
const state = reactive({
  zoneUUID: '',
  zoneName: '',
});

function onSubmit(values: Record<string, any>) {
  modalApi.lock();

  importCogsHandlingFees(values)
    .then(() => {
      message.success(
        'The file has been uploaded successfully and is being processed',
      );
    })
    .finally(() => {
      modalApi.setData({ processing: true });
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
      component: markRaw(UploadCmp),
      fieldName: 'csvFile',
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
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { zoneUUID, deleteMode } = modalApi.getData<any>();

      if (!zoneUUID) {
        return;
      }

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
    confirm-text="Submit"
    title="Import products"
    :close-on-click-modal="false"
  >
    <Form />
  </Modal>
</template>
