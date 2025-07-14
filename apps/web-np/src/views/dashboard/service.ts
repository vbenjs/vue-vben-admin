import { reactive } from 'vue';

import { customerGetLTVReport, orderGetPAndLReport } from '#/api';
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

export type DashboardData = {
  calcChart: boolean;
  customerTotal: {
    netPayment: number;
    newCustomers: number;
    quantityRepurchase: number;
  };
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  orderTotal: {
    cogs: number;
    discount: number;
    grossProfit: number;
    grossSales: number;
    handlingFees: number;
    netPayment: number;
    netProfit: number;
    netProfitMargin: string;
    poas: number;
    quantityOrder: number;
    refund: number;
    roas: number;
    shippingCosts: number;
    totalAdSpend: number;
    totalCosts: number;
    totalCustomCost: number;
    totalShipping: number;
    totalTax: number;
    totalTip: number;
    transactionFees: number;
  };
  rawCustomCosts: any[];
  rawOrders: any[];
};

export const dashboardState = reactive({
  loading: false,
  profitChart: {
    groupBy: 'daily',
    xAxis: [] as any[],
    revenue: [] as any[],
    totalCosts: [] as any[],
    netProfit: [] as any[],
    netProfitMargin: [] as any[],
  },
});

export const currentPeriod = reactive<DashboardData>({
  dateRange: [dayjs().add(-29, 'day'), dayjs()],
  rawOrders: [] as any[],
  rawCustomCosts: [] as any[],
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
  calcChart: true,
});

export const previousPeriod = reactive<DashboardData>({
  dateRange: [dayjs().add(-60, 'day'), dayjs().add(-30, 'day')],
  rawOrders: [] as any[],
  rawCustomCosts: [] as any[],
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
  calcChart: false,
});

export const loadDataByPeriod = (payload: DashboardData) => {
  dashboardState.loading = true;

  const fromDate = payload.dateRange[0].format('YYYY-MM-DD');
  const toDate = payload.dateRange[1].format('YYYY-MM-DD');

  orderGetPAndLReport({
    groupBy: 'daily',
    fromDate,
    toDate,
  })
    .then((res) => {
      const items = res.items.reverse();

      if (payload.calcChart) {
        if (items.length > 62) {
          dashboardState.profitChart.groupBy = 'monthly';
        } else if (items.length > 32) {
          dashboardState.profitChart.groupBy = 'weekly';
        } else {
          dashboardState.profitChart.groupBy = 'daily';
        }
      }

      payload.rawOrders = items;
      payload.rawCustomCosts = res.customCostList;

      generateDashboardData(payload);
    })
    .finally(() => {
      dashboardState.loading = false;
    });

  customerGetLTVReport({
    fromMonth: fromDate,
    toMonth: toDate,
  }).then((res) => {
    generateCutomerLTV(res.items, payload);
  });
};

const generateCutomerLTV = (data: any, payload: DashboardData) => {
  payload.customerTotal.newCustomers = 0;
  payload.customerTotal.quantityRepurchase = 0;
  payload.customerTotal.netPayment = 0;

  data.forEach((item: any) => {
    payload.customerTotal.newCustomers += item.quantityNew;
    payload.customerTotal.quantityRepurchase += item.quantityRepurchase;
    payload.customerTotal.netPayment += item.netPayment;
  });
};

export const generateDashboardData = (payload: DashboardData) => {
  let items = payload.rawOrders;
  const customCostList = payload.rawCustomCosts;

  if (payload.calcChart && dashboardState.profitChart.groupBy !== 'daily') {
    items = groupData(items, dashboardState.profitChart.groupBy);
  }

  addExtraFields(items);

  calcOrderStatistic(items, payload);

  if (payload.calcChart) {
    generateProfitChartData(items, customCostList);
  }
};

const generateProfitChartData = (data: any, costName: any) => {
  // Build xAxis - start
  const _xAxisData: any[] = [];

  data.forEach((item: any) => {
    _xAxisData.push(item.date);
  });

  dashboardState.profitChart.xAxis = _xAxisData;
  // Build xAxis - end

  const _lineData = transformDataRowToColumn(data, costName);

  dashboardState.profitChart.revenue = getDataByColumnName('netPayment');
  dashboardState.profitChart.totalCosts = getDataByColumnName(
    'totalCosts',
    true,
  );
  dashboardState.profitChart.netProfit = getDataByColumnName('netProfit');

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

const calcOrderStatistic = (data: any, payload: DashboardData) => {
  const itemTotal = createTotalRow(data);

  payload.orderTotal.quantityOrder = itemTotal.totalOrders ?? 0;
  payload.orderTotal.totalTip = itemTotal.totalTip ?? 0;
  payload.orderTotal.totalShipping = itemTotal.totalShipping ?? 0;

  payload.orderTotal.grossSales = itemTotal.grossSales ?? 0;
  payload.orderTotal.discount = itemTotal.totalDiscount ?? 0;
  payload.orderTotal.refund = itemTotal.totalRefund ?? 0;
  payload.orderTotal.netPayment = itemTotal.netPayment ?? 0;

  payload.orderTotal.cogs = itemTotal.cogs ?? 0;
  payload.orderTotal.handlingFees = itemTotal.handlingFees ?? 0;
  payload.orderTotal.shippingCosts = itemTotal.shippingCosts ?? 0;
  payload.orderTotal.transactionFees = itemTotal.transactionFees ?? 0;
  payload.orderTotal.grossProfit = itemTotal.grossProfit ?? 0;

  payload.orderTotal.totalCustomCost = itemTotal.totalCustomCost ?? 0;
  payload.orderTotal.totalAdSpend = itemTotal.totalAdSpend ?? 0;
  payload.orderTotal.totalTax = itemTotal.totalTax ?? 0;
  payload.orderTotal.totalCosts = itemTotal.totalCosts ?? 0;
  payload.orderTotal.netProfit = itemTotal.netProfit ?? 0;

  if (payload.orderTotal.totalAdSpend) {
    payload.orderTotal.roas =
      payload.orderTotal.netPayment / payload.orderTotal.totalAdSpend;

    payload.orderTotal.poas =
      payload.orderTotal.grossProfit / payload.orderTotal.totalAdSpend;
  }

  payload.orderTotal.netProfitMargin = payload.orderTotal.netPayment
    ? toPercentage(payload.orderTotal.netProfit / payload.orderTotal.netPayment)
    : '0';
};
