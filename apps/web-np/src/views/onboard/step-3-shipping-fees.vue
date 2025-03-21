<script lang="ts" setup>
import { onBeforeMount } from 'vue';

import { Card, InputNumber, RadioButton, RadioGroup } from 'ant-design-vue';

import { ShippingCostLevel } from '#/constants';
import { useShopStore } from '#/store';
import { formatMoney } from '#/utils';

import { onboardForm, sampleOrder } from './service';

const shopStore = useShopStore();

const getUnitName = () => {
  return onboardForm.shippingFeeLevel === ShippingCostLevel.QUANTITY
    ? '/ Item'
    : '/ Kg';
};

const handleChange = () => {
  let totlaUnit = sampleOrder.totalWeight;

  if (onboardForm.shippingFeeLevel === ShippingCostLevel.QUANTITY) {
    totlaUnit = sampleOrder.lineItems.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
  }
  sampleOrder.shippingFees = onboardForm.shippingFeePrice * totlaUnit;
};

const totalQuantity = sampleOrder.lineItems.reduce(
  (acc, item) => acc + item.quantity,
  0,
);

onBeforeMount(() => {
  handleChange();
});
</script>

<template>
  <Card title="Shipping Costs">
    <p>
      Shipping costs are the fees charged to transport goods from one location
      to another. They are added to the cost of the products ordered by a
      customer.
    </p>

    <div class="mt-5 flex justify-between">
      <div class="font-semibold">The shipping costs will be calculated by</div>

      <RadioGroup
        @change="handleChange"
        class="w-full max-w-48"
        v-model:value="onboardForm.shippingFeeLevel"
      >
        <RadioButton
          class="w-full max-w-24"
          :value="ShippingCostLevel.QUANTITY"
        >
          Quantity
        </RadioButton>
        <RadioButton class="w-full max-w-24" :value="ShippingCostLevel.WEIGHT">
          Weight
        </RadioButton>
      </RadioGroup>
    </div>

    <div class="mt-2 flex justify-between">
      <div class="font-semibold">Default shipping cost for 1 unit</div>

      <InputNumber
        :addon-after="getUnitName()"
        :min="0"
        :prefix="shopStore.shop.currencySymbol"
        @change="handleChange"
        v-model:value="onboardForm.shippingFeePrice"
        class="w-full max-w-48"
      />
    </div>

    <table class="mt-5 min-w-full divide-y">
      <thead>
        <tr>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Example order
          </th>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Total Quantity
          </th>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Total Weight
          </th>
          <th class="px-6 py-3 text-end text-xs font-medium uppercase">
            Shipping costs
          </th>
        </tr>
      </thead>
      <tbody class="divide-y">
        <tr>
          <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">#9999</td>
          <td class="px-6 py-4 text-start text-sm">
            {{ totalQuantity }}
          </td>
          <td class="px-6 py-4 text-start text-sm">
            {{ sampleOrder.totalWeight }}
          </td>
          <td class="px-6 py-4 text-end text-sm font-bold">
            {{ formatMoney(sampleOrder.shippingFees, shopStore.shop.currency) }}
          </td>
        </tr>
      </tbody>
    </table>
  </Card>
</template>
