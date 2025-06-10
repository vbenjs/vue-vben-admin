<script lang="ts" setup>
import { onBeforeMount } from 'vue';

import { Card, InputNumber, Slider } from 'ant-design-vue';

import { formatMoney } from '#/shared/utils';
import { useShopStore } from '#/store';

import { onboardForm, sampleOrder } from './service';

const shopStore = useShopStore();

const calcCogs = (price: number, quantity: number) => {
  return (price * quantity * onboardForm.cogsRate) / 100;
};

const handleCogsRateChange = () => {
  sampleOrder.lineItems.forEach((item) => {
    item.cogs = calcCogs(item.price, item.quantity);
  });

  sampleOrder.totalCogs =
    sampleOrder.lineItems.reduce((acc, item) => acc + item.cogs, 0) || 0;

  sampleOrder.grossSales = sampleOrder.lineItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
};

onBeforeMount(() => {
  handleCogsRateChange();
});
</script>

<template>
  <Card title="Cost of goods sold (COGS)">
    <template #extra>
      <a
        href="https://www.shopify.com/retail/cost-of-goods-sold"
        target="_blank"
      >
        More
      </a>
    </template>
    <p>
      Cost of goods sold (COGS) is the direct cost of producing products that
      your business sells. Also referred to as "cost of sales", COGS includes
      the cost of materials and labor directly related to the production of
      retail products.
    </p>

    <div class="mt-5 flex">
      <div class="font-semibold">Set default COGS rate for 1 item:</div>
      <div class="ml-5 font-bold">{{ onboardForm.cogsRate }}%</div>
    </div>

    <Slider
      @change="handleCogsRateChange"
      v-model:value="onboardForm.cogsRate"
      :marks="{
        0: '0%',
        75: '75%',
        100: '100%',
      }"
    />

    <table class="min-w-full divide-y">
      <thead>
        <tr>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Example product
          </th>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Sale price
          </th>
          <th class="px-6 py-3 text-start text-xs font-medium uppercase">
            Quantity
          </th>
          <th class="px-6 py-3 text-end text-xs font-medium uppercase">COGS</th>
        </tr>
      </thead>
      <tbody class="divide-y">
        <tr v-for="(item, index) in sampleOrder.lineItems" :key="index">
          <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
            {{ item.name }}
          </td>
          <td class="px-6 py-4 text-start text-sm">
            <InputNumber
              :min="0"
              :prefix="shopStore.shop.currencySymbol"
              v-model:value="item.price"
              @change="handleCogsRateChange"
              class="w-full max-w-48"
              size="small"
            />
          </td>
          <td class="px-6 py-4 text-start text-sm">
            <InputNumber
              :min="0"
              class="w-full max-w-48"
              size="small"
              v-model:value="item.quantity"
              @change="handleCogsRateChange"
            />
          </td>
          <td class="px-6 py-4 text-end text-sm font-bold">
            {{ formatMoney(item.cogs, shopStore.shop.currency) }}
          </td>
        </tr>
      </tbody>
    </table>
  </Card>
</template>
