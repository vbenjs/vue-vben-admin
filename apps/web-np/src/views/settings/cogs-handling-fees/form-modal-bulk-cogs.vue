<script lang="ts" setup>
import type { IProduct } from './table-config';

import { reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message, TypographyParagraph } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { productBulkUpdateFees } from '#/api';
import { useShopStore } from '#/store';

const state = reactive({
  zoneUUID: '' as string,
  checkedItems: [] as IProduct[],
});

const shopStore = useShopStore();

function onSubmit(values: Record<string, any>) {
  modalApi.lock();

  if (state.checkedItems.length === 0) {
    message.error('Please select at least one product.');
    modalApi.lock(false);
    return;
  }

  const payload = state.checkedItems.map((item: IProduct) => ({
    id: item.id,
    variantId: item.variantId,
    productId: item.productId,
    parentId: item.parentId,
  }));

  productBulkUpdateFees({
    ...values,
    regionId: state.zoneUUID,
    selectedItems: payload,
    type: 'COGS',
  })
    .then(() => {
      message.success('Bulk COGS updated successfully.');
      modalApi.setData({ reload: true });
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
    componentProps: {
      class: 'w-full',
    },
    labelClass: 'w-2/8',
  },
  schema: [
    {
      component: 'InputNumber',
      fieldName: 'cogsFee',
      label: 'COGS Fees',
      defaultValue: 1,
      componentProps: {
        addonAfter: shopStore.shop.currency,
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
      const { checkedItems, regionId } = modalApi.getData<any>();

      state.checkedItems = checkedItems;
      state.zoneUUID = regionId;
    }
  },
});
</script>
<template>
  <Modal
    class="w-[700px]"
    title="Bulk Action - Update COGS for Manual COGS Source"
    confirm-text="Submit"
  >
    <Form />

    <TypographyParagraph class="mt-5 px-5 pl-10 text-left italic">
      <span class="font-semibold">Note:</span>
      This feature only affects items with
      <span class="font-semibold">Manual COGS Source</span>. Please recalculate
      the costs after updating the COGS.
    </TypographyParagraph>
  </Modal>
</template>
