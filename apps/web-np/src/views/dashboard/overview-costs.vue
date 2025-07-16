<script setup lang="ts">
import { computed } from 'vue';

import { Card, CardContent, CardHeader, CardTitle } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { formatMoney } from '#/shared/utils';
import { useShopStore } from '#/store';

import {
  currentPeriod,
  dashboardState,
  getChangePercentColor,
  previousPeriod,
} from './service';

const shopStore = useShopStore();
const currency = shopStore.shop.currencyFromApp;
const rate = shopStore.shop.currencyRate;

const getData = computed(() => {
  return [
    {
      title: $t('field-name.totalCosts'),
      explain: $t('field-name.totalCostsExplain'),
      value: formatMoney(currentPeriod.pAndLReport.totalCosts, currency, rate),
      isBold: true,
    },
    {
      title: $t('field-name.cogs'),
      explain: $t('field-name.cogsExplain'),
      value: formatMoney(currentPeriod.pAndLReport.cogs, currency, rate),
      changePercent: dashboardState.changePercent.cogs,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.cogs,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.handlingFees'),
      explain: $t('field-name.handlingFeesExplain'),
      value: formatMoney(
        currentPeriod.pAndLReport.handlingFees,
        currency,
        rate,
      ),
      changePercent: dashboardState.changePercent.handlingFees,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.handlingFees,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.shippingCosts'),
      value: formatMoney(
        currentPeriod.pAndLReport.shippingCosts,
        currency,
        rate,
      ),
      changePercent: dashboardState.changePercent.shippingCosts,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.shippingCosts,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.transactionFees'),
      value: formatMoney(
        currentPeriod.pAndLReport.transactionFees,
        currency,
        rate,
      ),
      changePercent: dashboardState.changePercent.transactionFees,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.transactionFees,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.totalCustomCost'),
      value: formatMoney(
        currentPeriod.pAndLReport.totalCustomCost,
        currency,
        rate,
      ),
      changePercent: dashboardState.changePercent.totalCustomCost,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.totalCustomCost,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.totalAdSpend'),
      value: formatMoney(
        currentPeriod.pAndLReport.totalAdSpend,
        currency,
        rate,
      ),
      changePercent: dashboardState.changePercent.totalAdSpend,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.totalAdSpend,
        currency,
        rate,
      ),
    },
  ];
});
</script>

<template>
  <Card class="w-full">
    <CardHeader class="pb-2">
      <CardTitle class="text-md flex items-center justify-between">
        <span>Cost Summary</span>
      </CardTitle>
    </CardHeader>

    <CardContent class="text-md">
      <div
        v-for="(item, index) in getData"
        :key="index"
        class="mt-2 flex w-full items-center justify-between"
      >
        <div
          class="flex items-center space-x-1"
          :class="item.isBold ? 'font-semibold' : ''"
        >
          <span>{{ item.title }}</span>

          <template v-if="item.explain">
            <IconifyIcon
              v-tippy="{
                content: item.explain,
              }"
              icon="ant-design:question-circle-outlined"
            />
          </template>
        </div>
        <div class="flex space-x-2">
          <div :class="item.isBold ? 'font-semibold' : ''">
            {{ item.value }}
          </div>
          <div class="w-[60px] text-right italic">
            <span
              v-if="item.changePercent && item.previousValue"
              :class="getChangePercentColor(item.changePercent)"
              v-tippy="{
                content: item.previousValue
                  ? `Compared with ${item.previousValue}`
                  : '',
              }"
            >
              {{ item.changePercent }}
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
