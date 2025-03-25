<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { Grid } from './table-config';

const columnNames: any = {
  grossSales: 'Gross Sales',
  customerFee: 'Customer Extra Paid',
  discount: 'Discount',
  refundTotal: 'Refund',
  netPayment: 'Revenue',
  cogs: 'COGS',
  handlingFees: 'Handling Fees',
  shippingCosts: 'Shipping Costs',
  transactionFees: 'Transaction Fees',
  grossProfit: 'Gross Profit',
  taxesTotal: 'Collected Taxes',
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #id="{ row: { id } }">
        <div class="font-semibold">
          {{ columnNames[id] ?? '' }}
        </div>
      </template>
    </Grid>
  </Page>
</template>
