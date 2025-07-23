import type { ITransactionFee } from '#/store';

import { reactive } from 'vue';

import { ShippingCostLevel } from '#/shared/constants';

export const sampleOrder = reactive({
  grossSales: 0,
  totalQuantity: 0,
  totalCogs: 0,
  totalHandlingFees: 0,
  shippingFees: 0,
  transactionFees: 0,
  totalWeight: 0.5,
  paymentGatewayName: 'other',

  lineItems: [
    {
      name: 'T-Shirt',
      price: 10,
      quantity: 1,
      cogs: 0,
      handlingFees: 0,
    },
    {
      name: 'Shoes',
      price: 45,
      quantity: 2,
      cogs: 0,
      handlingFees: 0,
    },
  ],
});

export const onboardForm = reactive({
  cogsRate: 0,
  cogsFromShopify: true,
  handlingFees: 1,
  shippingFeeLevel: ShippingCostLevel.QUANTITY,
  shippingFeePrice: 0,
  transactionFees: [] as ITransactionFee[],
});
