import { reactive } from 'vue';

import dayjs from 'dayjs';

import { getPAndLReport } from '#/api';
import { toPercentage } from '#/utils';

import { createTotalRow } from '../reports/p-and-l/service';

export const state = reactive({
  orderLoading: false,
  orderTotal: {
    quantityOrder: 0,
    totalTip: 0,
    totalShipping: 0,
    grossSales: 0,
    discount: 0,
    refund: 0,
    netPayment: 0,
    cogs: 0,
    handlingFees: 0,
    shippingCosts: 0,
    transactionFees: 0,
    grossProfit: 0,
    totalTax: 0,
    customCost: 0,
    netProfit: 0,
    netProfitMargin: '0',
  },
  dateRange: [dayjs().subtract(1, 'y'), dayjs()],
});

export const reloadData = () => {
  state.orderLoading = true;
  getPAndLReport({
    groupBy: 'daily',
    fromDate: state.dateRange[0]?.format('YYYY-MM-DD'),
    toDate: state.dateRange[1]?.format('YYYY-MM-DD'),
  })
    .then((res) => {
      const itemTotal = createTotalRow(res.items);

      state.orderTotal.quantityOrder = itemTotal.totalOrders ?? 0;
      state.orderTotal.totalTip = itemTotal.totalTip ?? 0;
      state.orderTotal.totalShipping = itemTotal.totalShipping ?? 0;

      state.orderTotal.grossSales = itemTotal.grossSales ?? 0;
      state.orderTotal.discount = itemTotal.totalDiscount ?? 0;
      state.orderTotal.refund = itemTotal.totalRefund ?? 0;
      state.orderTotal.netPayment = itemTotal.netPayment ?? 0;

      state.orderTotal.cogs = itemTotal.cogs ?? 0;
      state.orderTotal.handlingFees = itemTotal.handlingFees ?? 0;
      state.orderTotal.shippingCosts = itemTotal.shippingCosts ?? 0;
      state.orderTotal.transactionFees = itemTotal.transactionFees ?? 0;
      state.orderTotal.grossProfit = itemTotal.grossProfit ?? 0;

      state.orderTotal.customCost = itemTotal.totalCustomCost ?? 0;
      state.orderTotal.totalTax = itemTotal.totalTax ?? 0;

      state.orderTotal.netProfit =
        state.orderTotal.grossProfit -
        state.orderTotal.totalTax -
        state.orderTotal.customCost;

      state.orderTotal.netProfitMargin = state.orderTotal.netPayment
        ? toPercentage(state.orderTotal.netProfit / state.orderTotal.netPayment)
        : '0';
    })
    .finally(() => {
      state.orderLoading = false;
    });
};
