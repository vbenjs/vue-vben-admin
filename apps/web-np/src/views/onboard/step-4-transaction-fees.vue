<script lang="ts" setup>
import { onBeforeMount } from 'vue';

import { Card, InputNumber } from 'ant-design-vue';

import { formatMoney, toRate } from '#/shared/utils';
import { useShopStore } from '#/store';

import { onboardForm, sampleOrder } from './service';

const shopStore = useShopStore();

const handleChange = () => {
  const feeInfo = onboardForm.transactionFees.find(
    (item) => item.handleName === sampleOrder.paymentGatewayName,
  );

  if (!feeInfo) {
    sampleOrder.transactionFees = 0;
    return;
  }
  const rate = toRate(
    feeInfo.percentageFee * 1 + feeInfo.externalFeePercentage * 1,
  );

  sampleOrder.transactionFees =
    sampleOrder.grossSales * rate + feeInfo.fixedFee;
};

onBeforeMount(() => {
  handleChange();
});
</script>

<template>
  <Card title="Transaction Fees">
    <table class="min-w-full divide-y">
      <thead>
        <tr>
          <th class="px-2 py-3 text-start text-xs font-semibold uppercase">
            Payment gateways
          </th>
          <th class="px-2 py-3 text-start text-xs font-semibold uppercase">
            Fixed fees
          </th>
          <th class="px-2 py-3 text-start text-xs font-semibold uppercase">
            Percentage fees
          </th>
          <th class="px-2 py-3 text-start text-xs font-semibold uppercase">
            Shopify external fees
          </th>
        </tr>
      </thead>
      <tbody class="divide-y">
        <tr v-for="item in onboardForm.transactionFees" :key="item.uuid">
          <td class="whitespace-nowrap px-2 py-4 text-sm font-semibold">
            {{ item.name }}
          </td>
          <td class="px-2 py-4 text-start text-sm">
            <InputNumber
              :min="0"
              @change="handleChange"
              :prefix="shopStore.shop.currencySymbol"
              :addon-after="shopStore.shop.currency"
              v-model:value="item.fixedFee"
              class="w-full max-w-48"
              size="small"
            />
          </td>
          <td class="px-2 py-4 text-start text-sm">
            <InputNumber
              :min="0"
              @change="handleChange"
              addon-after="%"
              v-model:value="item.percentageFee"
              class="w-full max-w-48"
              size="small"
            />
          </td>
          <td class="px-2 py-4 text-start text-sm">
            <InputNumber
              :min="0"
              @change="handleChange"
              addon-after="%"
              v-model:value="item.externalFeePercentage"
              class="w-full max-w-48"
              size="small"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div class="my-5 text-center text-xs italic">
      * Transaction fees = Fixed fees + [Net payment * (Percentage fees +
      Shopify external fees) / 100]
    </div>

    <table class="min-w-full divide-y">
      <thead>
        <tr>
          <th class="px-2 py-3 text-start text-xs font-semibold uppercase">
            Example order
          </th>
          <th class="px-2 py-3 text-center text-xs font-semibold uppercase">
            Net Payment
          </th>
          <th class="px-2 py-3 text-center text-xs font-semibold uppercase">
            Payment gateways
          </th>
          <th class="px-2 py-3 text-end text-xs font-semibold uppercase">
            Transaction Fees
          </th>
        </tr>
      </thead>
      <tbody class="divide-y">
        <tr>
          <td class="whitespace-nowrap px-2 py-4 text-sm font-semibold">
            #9999
          </td>
          <td class="px-2 py-4 text-center text-sm">
            {{ formatMoney(sampleOrder.grossSales, shopStore.shop.currency) }}
          </td>
          <td class="px-2 py-4 text-center text-sm">Other</td>
          <td class="px-2 py-4 text-end text-sm font-bold">
            {{
              formatMoney(sampleOrder.transactionFees, shopStore.shop.currency)
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </Card>
</template>
