<script lang="ts" setup>
import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useShopStore } from '#/store';
import { formatMoney, numberWithCommas } from '#/utils';

import { Grid } from './table-config';

const shopStore = useShopStore();

const hasBold = (id: string) =>
  [
    'grossProfit',
    'grossSales',
    'netPayment',
    'netProfit',
    'netProfitMargin',
  ].includes(id);

const formatVal = (rowName: string, val: any) => {
  if (rowName === 'netProfitMargin') {
    return numberWithCommas(`${val}%`);
  }

  return formatMoney(
    val,
    shopStore.shop.currencyFromApp,
    shopStore.shop.currencyRate,
  );
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #id="{ row: { id } }">
        <div :class="[{ 'font-semibold': hasBold(id) }]">
          {{ $t(`field-name.${id}`) }}
        </div>
      </template>
      <template #date="{ row, column: { field } }">
        <div :class="[{ 'font-semibold': hasBold(row.id) }]">
          {{ formatVal(row.id, row[field]) }}
        </div>
      </template>
    </Grid>
  </Page>
</template>
