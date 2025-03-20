<script lang="ts" setup>
import { useShopStore } from '#/store';
import { formatMoney } from '#/utils';

import { CustomCostType } from './service';

interface Props {
  type: CustomCostType;
  amount: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: CustomCostType.DAILY,
  amount: 0,
});

const shopStore = useShopStore();

interface IReport {
  date: string;
  grossSale: number;
  revenue: number;
  grossProfit: number;
}

const sampleReport: IReport[] = [
  {
    date: 'Date 1',
    grossSale: 750,
    revenue: 700,
    grossProfit: 300,
  },
  {
    date: 'Date 2',
    grossSale: 920,
    revenue: 870,
    grossProfit: 520,
  },
];

const calcDailyCost = (item: IReport, format: boolean = true) => {
  let amount = 0;
  switch (props.type) {
    case CustomCostType.DAILY:
    case CustomCostType.MONTHLY:
    case CustomCostType.ONE_TIME:
    case CustomCostType.WEEKLY: {
      amount = props.amount;
      break;
    }

    case CustomCostType.GROSS_SALE_PERCENTAGE: {
      amount = item.grossProfit * (props.amount / 100);
      break;
    }
  }

  if (format === false) {
    return amount;
  }

  return formatMoney(amount, shopStore.shop.currency);
};

const calcNetProfit = (item: IReport) => {
  const amount = item.grossProfit - (calcDailyCost(item, false) as number);

  return formatMoney(amount, shopStore.shop.currency);
};
</script>
<template>
  <table class="min-w-full divide-y">
    <thead>
      <tr>
        <th class="px-6 py-3 text-center text-xs font-medium uppercase">
          Example Date
        </th>
        <th class="px-6 py-3 text-end text-xs font-medium uppercase">
          Gross sale
        </th>
        <th class="px-6 py-3 text-end text-xs font-medium uppercase">
          Revenue
        </th>
        <th class="px-6 py-3 text-end text-xs font-medium uppercase">
          Gross profit
        </th>
        <th class="px-6 py-3 text-end text-xs font-medium uppercase">
          Daily Cost
        </th>
        <th class="px-6 py-3 text-end text-xs font-medium uppercase">
          Net profit
        </th>
      </tr>
    </thead>
    <tbody class="divide-y">
      <tr v-for="(item, index) in sampleReport" :key="index">
        <td class="px-6 py-4 text-center text-sm">
          {{ item.date }}
        </td>
        <td class="px-6 py-4 text-end text-sm">
          {{ formatMoney(item.grossSale, shopStore.shop.currency) }}
        </td>
        <td class="px-6 py-4 text-end text-sm">
          {{ formatMoney(item.revenue, shopStore.shop.currency) }}
        </td>
        <td class="px-6 py-4 text-end text-sm">
          {{ formatMoney(item.grossProfit, shopStore.shop.currency) }}
        </td>
        <td class="px-6 py-4 text-end text-sm font-bold">
          {{ calcDailyCost(item) }}
        </td>
        <td class="px-6 py-4 text-end text-sm italic">
          {{ calcNetProfit(item) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
