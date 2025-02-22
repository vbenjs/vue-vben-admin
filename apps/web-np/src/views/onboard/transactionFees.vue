<script lang="ts" setup>
import { onBeforeMount } from 'vue';

import { Card, InputNumber } from 'ant-design-vue';

import { useShopStore } from '#/store';
import { formatMoney, toRate } from '#/utils';

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
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Payment gateways
          </th>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Fixed fees
          </th>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Percentage fees
          </th>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Shopify external fees
          </th>
        </tr>
      </thead>
      <tbody class="divide-y">
        <tr v-for="item in onboardForm.transactionFees" :key="item.uuid">
          <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
            {{ item.name }}
          </td>
          <td class="px-6 py-4 text-start text-sm">
            <InputNumber
              :min="0"
              @change="handleChange"
              :prefix="shopStore.shop.currencySymbol"
              v-model:value="item.fixedFee"
              class="w-full max-w-48"
              size="small"
            />
          </td>
          <td class="px-6 py-4 text-start text-sm">
            <InputNumber
              :min="0"
              @change="handleChange"
              addon-after="%"
              v-model:value="item.percentageFee"
              class="w-full max-w-48"
              size="small"
            />
          </td>
          <td class="px-6 py-4 text-start text-sm">
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
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Example order
          </th>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Net Payment
          </th>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Payment gateways
          </th>
          <th class="px-6 py-3 text-end text-xs font-medium uppercase">
            Transaction Fees
          </th>
        </tr>
      </thead>
      <tbody class="divide-y">
        <tr>
          <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">#9999</td>
          <td class="px-6 py-4 text-start text-sm">
            {{ formatMoney(sampleOrder.grossSales, shopStore.shop.currency) }}
          </td>
          <td class="px-6 py-4 text-start text-sm">Other</td>
          <td class="px-6 py-4 text-end text-sm font-bold">
            {{
              formatMoney(sampleOrder.transactionFees, shopStore.shop.currency)
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </Card>
</template>
