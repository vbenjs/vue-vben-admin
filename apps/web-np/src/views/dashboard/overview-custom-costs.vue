<script setup lang="ts">
import { computed } from 'vue';

import { Card, CardContent, CardHeader, CardTitle } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { formatMoney, toPercentage } from '#/shared/utils';
import { useShopStore } from '#/store';

import { currentPeriod } from './service';

const shopStore = useShopStore();
const currency = shopStore.shop.currencyFromApp;
const rate = shopStore.shop.currencyRate;

const getData = computed(() => {
  const totalCost = currentPeriod.orderTotal.totalCosts;
  return [
    {
      title: $t('field-name.totalCosts'),
      explain: $t('field-name.totalCostsExplain'),
      value: formatMoney(totalCost, currency, rate),
      percent: 0,
    },
    {
      title: $t('field-name.cogs'),
      explain: $t('field-name.cogsExplain'),
      value: formatMoney(
        currentPeriod.orderTotal.cogs,
        shopStore.shop.currencyFromApp,
      ),
      percent: totalCost ? currentPeriod.orderTotal.cogs / totalCost : 0,
    },
    {
      title: $t('field-name.handlingFees'),
      explain: $t('field-name.handlingFeesExplain'),
      value: formatMoney(currentPeriod.orderTotal.handlingFees, currency, rate),
      percent: totalCost
        ? currentPeriod.orderTotal.handlingFees / totalCost
        : 0,
    },
    {
      title: $t('field-name.shippingCosts'),
      value: formatMoney(
        currentPeriod.orderTotal.shippingCosts,
        currency,
        rate,
      ),
      percent: totalCost
        ? currentPeriod.orderTotal.shippingCosts / totalCost
        : 0,
    },
    {
      title: $t('field-name.transactionFees'),
      value: formatMoney(
        currentPeriod.orderTotal.transactionFees,
        currency,
        rate,
      ),
      percent: totalCost
        ? currentPeriod.orderTotal.transactionFees / totalCost
        : 0,
    },
    {
      title: $t('field-name.totalCustomCost'),
      value: formatMoney(
        currentPeriod.orderTotal.totalCustomCost,
        currency,
        rate,
      ),
      percent: totalCost
        ? currentPeriod.orderTotal.totalCustomCost / totalCost
        : 0,
    },
    {
      title: $t('field-name.totalAdSpend'),
      value: formatMoney(currentPeriod.orderTotal.totalAdSpend, currency, rate),
      percent: totalCost
        ? currentPeriod.orderTotal.totalAdSpend / totalCost
        : 0,
    },
  ];
});
</script>

<template>
  <Card class="w-full" title="Order Summary">
    <CardHeader class="pb-2">
      <CardTitle class="text-md flex items-center justify-between">
        <span>Cost Summary</span>
        <!-- <VbenButton
          class="w-[100px] !p-0 text-right"
          size="xs"
          variant="link"
          @click="redirect('settings.custom-costs')"
        >
          View details
        </VbenButton> -->
      </CardTitle>
    </CardHeader>

    <CardContent class="text-md">
      <div
        v-for="(item, index) in getData"
        :key="index"
        class="mt-2 flex w-full items-center justify-between"
      >
        <div class="flex items-center space-x-1">
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
          <div>
            {{ item.value }}
          </div>
          <div class="text-muted-foreground w-[60px] text-right italic">
            <template v-if="item.percent">
              {{ toPercentage(item.percent) }}%
            </template>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
