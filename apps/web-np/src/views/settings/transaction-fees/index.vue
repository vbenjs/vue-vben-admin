<script lang="ts" setup>
import type { ITransactionFee } from '#/store';

import { onBeforeMount, reactive } from 'vue';

import { Page, VbenButton } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useShopSettingStore } from '#/store';
import { toPercentage } from '#/utils';
import { onboardForm, sampleOrder } from '#/views/onboard/service';
import TransactionFees from '#/views/onboard/transactionFees.vue';

const shopSettingStore = useShopSettingStore();
const state = reactive({
  loading: false,
});

onBeforeMount(() => {
  sampleOrder.grossSales = 100;

  handleReset();
});

const handleReset = () => {
  onboardForm.transactionFees = shopSettingStore.transactionFees.map(
    (item): ITransactionFee => ({
      ...item,
      fixedFee: item.fixedFee,
      percentageFee: toPercentage(item.percentageFee) as any,
      externalFeePercentage: toPercentage(item.externalFeePercentage) as any,
    }),
  );
};

const handleSubmit = () => {
  state.loading = true;

  shopSettingStore
    .setTransactionsFees(onboardForm.transactionFees)
    .then(() => {
      message.success('The transaction fees have been updated successfully');
    })
    .finally(() => {
      state.loading = false;
    });
};
</script>

<template>
  <Page>
    <TransactionFees />
    <div class="mr-10 mt-5 flex justify-end space-x-5">
      <VbenButton
        class="w-[100px]"
        variant="outline"
        @click="handleReset"
        :disabled="state.loading"
      >
        Reset
      </VbenButton>
      <VbenButton
        :loading="state.loading"
        class="w-[100px]"
        @click="handleSubmit"
      >
        Save
      </VbenButton>
    </div>
  </Page>
</template>
