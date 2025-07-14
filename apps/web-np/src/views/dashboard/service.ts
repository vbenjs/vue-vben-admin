import { reactive } from 'vue';

import { getLTVReport, orderGetPAndLReport } from '#/api';
import dayjs from '#/shared/dayjs';
import { convertRate, toPercentage } from '#/shared/utils';
import { useShopStore } from '#/store';

import {
  createTotalRow,
  groupData,
  transformDataRowToColumn,
} from '../reports/p-and-l/service';
import { addExtraFields } from '../reports/p-and-l/table-config';

const shopStore = useShopStore();

export const state = reactive({
  dateRange: [dayjs(), dayjs()],
  rawOrders: [] as any[],
  rawCustomCosts: [] as any[],
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
    totalCustomCost: 0,
    totalAdSpend: 0,
    roas: 0,
    poas: 0,
    netProfit: 0,
    netProfitMargin: '0',
    totalCosts: 0,
  },
  customerTotal: {
    newCustomers: 0,
    quantityRepurchase: 0,
    netPayment: 0,
  },
  charts: {
    profit: {
      groupBy: 'daily',
      xAxis: [] as any[],
      revenue: [] as any[],
      totalCosts: [] as any[],
      netProfit: [] as any[],
      netProfitMargin: [] as any[],
    },
  },
});

export const loadData = () => {
  state.orderLoading = true;
  orderGetPAndLReport({
    groupBy: 'daily',
    fromDate: state.dateRange[0]?.format('YYYY-MM-DD'),
    toDate: state.dateRange[1]?.format('YYYY-MM-DD'),
  })
    .then((res) => {
      const items = res.items.reverse();

      if (items.length > 62) {
        state.charts.profit.groupBy = 'monthly';
      } else if (items.length > 32) {
        state.charts.profit.groupBy = 'weekly';
      } else {
        state.charts.profit.groupBy = 'daily';
      }

      state.rawOrders = items;
      state.rawCustomCosts = res.customCostList;

      generateDashboardData();
    })
    .finally(() => {
      state.orderLoading = false;
    });

  getLTVReport({
    fromMonth: state.dateRange[0]?.format('YYYY-MM-DD'),
    toMonth: state.dateRange[1]?.format('YYYY-MM-DD'),
  }).then((res) => {
    generateCutomerLTV(res.items);
  });
};

const generateCutomerLTV = (data: any) => {
  state.customerTotal.newCustomers = 0;
  state.customerTotal.quantityRepurchase = 0;
  state.customerTotal.netPayment = 0;

  data.forEach((item: any) => {
    state.customerTotal.newCustomers += item.quantityNew;
    state.customerTotal.quantityRepurchase += item.quantityRepurchase;
    state.customerTotal.netPayment += item.netPayment;
  });
};

export const generateDashboardData = () => {
  let items = state.rawOrders;
  const customCostList = state.rawCustomCosts;

  if (state.charts.profit.groupBy !== 'daily') {
    items = groupData(items, state.charts.profit.groupBy);
  }

  addExtraFields(items);

  calcOrderStatistic(items);

  generateProfitChartData(items, customCostList);
};

const generateProfitChartData = (data: any, costName: any) => {
  // Build xAxis - start
  const _xAxisData: any[] = [];

  data.forEach((item: any) => {
    _xAxisData.push(item.date);
  });

  state.charts.profit.xAxis = _xAxisData;
  // Build xAxis - end

  const _lineData = transformDataRowToColumn(data, costName);

  state.charts.profit.revenue = getDataByColumnName('netPayment');
  state.charts.profit.totalCosts = getDataByColumnName('totalCosts', true);
  state.charts.profit.netProfit = getDataByColumnName('netProfit');

  function getDataByColumnName(name: string, isNag: boolean = false) {
    const _revenue = _lineData.find((el) => el.id === name);
    if (_revenue) {
      return Object.entries(_revenue)
        .filter(([key]) => key !== 'id')
        .map(([, value]) => {
          const val = convertRate(value, shopStore.shop.currencyRate);
          return isNag ? val * -1 : val;
        });
    }
    return [];
  }
};

const calcOrderStatistic = (data: any) => {
  const itemTotal = createTotalRow(data);

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

  state.orderTotal.totalCustomCost = itemTotal.totalCustomCost ?? 0;
  state.orderTotal.totalAdSpend = itemTotal.totalAdSpend ?? 0;
  state.orderTotal.totalTax = itemTotal.totalTax ?? 0;
  state.orderTotal.totalCosts = itemTotal.totalCosts ?? 0;
  state.orderTotal.netProfit = itemTotal.netProfit ?? 0;

  if (state.orderTotal.totalAdSpend) {
    state.orderTotal.roas =
      state.orderTotal.netPayment / state.orderTotal.totalAdSpend;

    state.orderTotal.poas =
      state.orderTotal.grossProfit / state.orderTotal.totalAdSpend;
  }

  state.orderTotal.netProfitMargin = state.orderTotal.netPayment
    ? toPercentage(state.orderTotal.netProfit / state.orderTotal.netPayment)
    : '0';
};
