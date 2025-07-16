import { reactive } from 'vue';

import { orderGetPAndLReport } from '#/api';
import dayjs from '#/shared/dayjs';
import { calcLTV, convertRate, toPercentage } from '#/shared/utils';
import { useShopStore } from '#/store';

import {
  createTotalRow,
  groupData,
  transformDataRowToColumn,
} from '../reports/p-and-l/service';
import { addExtraFields } from '../reports/p-and-l/table-config';

const shopStore = useShopStore();

export const dashboardState = reactive({
  loading: false,
  changePercent: {
    quantityOrder: '',
    netPayment: '',
    totalCosts: '',
    netProfit: '',
    totalShipping: '',
    totalTip: '',
    grossSales: '',
    discount: '',
    refund: '',
    cogs: '',
    handlingFees: '',
    shippingCosts: '',
    transactionFees: '',
    grossProfit: '',
    totalTax: '',
    totalCustomCost: '',
    totalAdSpend: '',
    facebook: '',
    tiktok: '',
    roas: '',
    poas: '',
    newCustomers: '',
  },
  profitChart: {
    groupBy: 'daily',
    xAxis: [] as any[],
    revenue: [] as any[],
    totalCosts: [] as any[],
    netProfit: [] as any[],
    netProfitMargin: [] as any[],
  },
});

export type DashboardData = {
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  dateRangeChanged: boolean;
  hasProfitChart: boolean;
  pAndLReport: {
    cogs: number;
    discount: number;
    facebook: number;
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
    tiktok: number;
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

export const currentPeriod = reactive<DashboardData>({
  dateRange: [dayjs().add(-6, 'day'), dayjs()],
  dateRangeChanged: false,
  rawOrders: [] as any[],
  rawCustomCosts: [] as any[],
  pAndLReport: {
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
    netProfit: 0,
    netProfitMargin: '0',
    totalCosts: 0,

    // Ad spend
    totalAdSpend: 0,
    roas: 0,
    poas: 0,
    facebook: 0,
    tiktok: 0,
  },
  hasProfitChart: true,
});

export const previousPeriod = reactive<DashboardData>({
  dateRange: [dayjs().add(-13, 'day'), dayjs().add(-7, 'day')],
  dateRangeChanged: false,
  rawOrders: [] as any[],
  rawCustomCosts: [] as any[],
  pAndLReport: {
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
    netProfit: 0,
    netProfitMargin: '0',
    totalCosts: 0,

    // Ad spend
    totalAdSpend: 0,
    roas: 0,
    poas: 0,
    facebook: 0,
    tiktok: 0,
  },
  hasProfitChart: false,
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

      if (payload.hasProfitChart) {
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

      calcChangePercent();
    });
};

export const calcChangePercent = () => {
  dashboardState.changePercent.quantityOrder = formatChange(
    currentPeriod.pAndLReport.quantityOrder,
    previousPeriod.pAndLReport.quantityOrder,
  );

  dashboardState.changePercent.netPayment = formatChange(
    currentPeriod.pAndLReport.netPayment,
    previousPeriod.pAndLReport.netPayment,
  );

  dashboardState.changePercent.totalCosts = formatChange(
    currentPeriod.pAndLReport.totalCosts,
    previousPeriod.pAndLReport.totalCosts,
  );

  dashboardState.changePercent.netProfit = formatChange(
    currentPeriod.pAndLReport.netProfit,
    previousPeriod.pAndLReport.netProfit,
  );

  dashboardState.changePercent.totalShipping = formatChange(
    currentPeriod.pAndLReport.totalShipping,
    previousPeriod.pAndLReport.totalShipping,
  );

  dashboardState.changePercent.totalTip = formatChange(
    currentPeriod.pAndLReport.totalTip,
    previousPeriod.pAndLReport.totalTip,
  );

  dashboardState.changePercent.grossSales = formatChange(
    currentPeriod.pAndLReport.grossSales,
    previousPeriod.pAndLReport.grossSales,
  );

  dashboardState.changePercent.discount = formatChange(
    currentPeriod.pAndLReport.discount,
    previousPeriod.pAndLReport.discount,
  );

  dashboardState.changePercent.refund = formatChange(
    currentPeriod.pAndLReport.refund,
    previousPeriod.pAndLReport.refund,
  );

  dashboardState.changePercent.cogs = formatChange(
    currentPeriod.pAndLReport.cogs,
    previousPeriod.pAndLReport.cogs,
  );

  dashboardState.changePercent.handlingFees = formatChange(
    currentPeriod.pAndLReport.handlingFees,
    previousPeriod.pAndLReport.handlingFees,
  );

  dashboardState.changePercent.shippingCosts = formatChange(
    currentPeriod.pAndLReport.shippingCosts,
    previousPeriod.pAndLReport.shippingCosts,
  );

  dashboardState.changePercent.transactionFees = formatChange(
    currentPeriod.pAndLReport.transactionFees,
    previousPeriod.pAndLReport.transactionFees,
  );

  dashboardState.changePercent.grossProfit = formatChange(
    currentPeriod.pAndLReport.grossProfit,
    previousPeriod.pAndLReport.grossProfit,
  );

  dashboardState.changePercent.totalTax = formatChange(
    currentPeriod.pAndLReport.totalTax,
    previousPeriod.pAndLReport.totalTax,
  );

  dashboardState.changePercent.totalCustomCost = formatChange(
    currentPeriod.pAndLReport.totalCustomCost,
    previousPeriod.pAndLReport.totalCustomCost,
  );

  dashboardState.changePercent.totalAdSpend = formatChange(
    currentPeriod.pAndLReport.totalAdSpend,
    previousPeriod.pAndLReport.totalAdSpend,
  );

  dashboardState.changePercent.facebook = formatChange(
    currentPeriod.pAndLReport.facebook,
    previousPeriod.pAndLReport.facebook,
  );

  dashboardState.changePercent.tiktok = formatChange(
    currentPeriod.pAndLReport.tiktok,
    previousPeriod.pAndLReport.tiktok,
  );

  dashboardState.changePercent.roas = formatChange(
    currentPeriod.pAndLReport.roas,
    previousPeriod.pAndLReport.roas,
  );

  dashboardState.changePercent.poas = formatChange(
    currentPeriod.pAndLReport.poas,
    previousPeriod.pAndLReport.poas,
  );
};

export const generateDashboardData = (payload: DashboardData) => {
  let items = payload.rawOrders;
  const customCostList = payload.rawCustomCosts;

  if (
    payload.hasProfitChart &&
    dashboardState.profitChart.groupBy !== 'daily'
  ) {
    items = groupData(items, dashboardState.profitChart.groupBy);
  }

  addExtraFields(items);

  calcOrderStatistic(items, payload);

  if (payload.hasProfitChart) {
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

  payload.pAndLReport.quantityOrder = itemTotal.totalOrders ?? 0;
  payload.pAndLReport.totalTip = itemTotal.totalTip ?? 0;
  payload.pAndLReport.totalShipping = itemTotal.totalShipping ?? 0;

  payload.pAndLReport.grossSales = itemTotal.grossSales ?? 0;
  payload.pAndLReport.discount = itemTotal.totalDiscount ?? 0;
  payload.pAndLReport.refund = itemTotal.totalRefund ?? 0;
  payload.pAndLReport.netPayment = itemTotal.netPayment ?? 0;

  payload.pAndLReport.cogs = itemTotal.cogs ?? 0;
  payload.pAndLReport.handlingFees = itemTotal.handlingFees ?? 0;
  payload.pAndLReport.shippingCosts = itemTotal.shippingCosts ?? 0;
  payload.pAndLReport.transactionFees = itemTotal.transactionFees ?? 0;
  payload.pAndLReport.grossProfit = itemTotal.grossProfit ?? 0;

  payload.pAndLReport.totalCustomCost = itemTotal.totalCustomCost ?? 0;
  payload.pAndLReport.totalAdSpend = itemTotal.totalAdSpend ?? 0;
  payload.pAndLReport.facebook = itemTotal.totalAdSpend_facebook ?? 0;
  payload.pAndLReport.tiktok = itemTotal.totalAdSpend_tiktok ?? 0;
  payload.pAndLReport.totalTax = itemTotal.totalTax ?? 0;
  payload.pAndLReport.totalCosts = itemTotal.totalCosts ?? 0;
  payload.pAndLReport.netProfit = itemTotal.netProfit ?? 0;

  if (payload.pAndLReport.totalAdSpend) {
    payload.pAndLReport.roas =
      payload.pAndLReport.netPayment / payload.pAndLReport.totalAdSpend;

    payload.pAndLReport.poas =
      payload.pAndLReport.grossProfit / payload.pAndLReport.totalAdSpend;
  }

  payload.pAndLReport.netProfitMargin = payload.pAndLReport.netPayment
    ? toPercentage(
        payload.pAndLReport.netProfit / payload.pAndLReport.netPayment,
      )
    : '0';
};

function calculatePercentageChange(
  newProfit: number,
  oldProfit: number,
): number {
  if (oldProfit === 0) {
    if (newProfit === 0) {
      return 0;
    }
    return newProfit > 0 ? Infinity : -Infinity;
  }

  return ((newProfit - oldProfit) / Math.abs(oldProfit)) * 100;
}

function formatChange(newProfit: number, oldProfit: number): string {
  const change = calculatePercentageChange(newProfit, oldProfit);

  if (change === 0) {
    return '';
  }

  if (change === Infinity || change === -Infinity) {
    return change > 0 ? '↑ ∞%' : '↓ ∞%';
  }

  const sign = change > 0 ? '↑ ' : '↓ ';

  return `${sign}${Math.round(change)}%`;
}

export const getChangePercentColor = (value: string) => {
  if (value.includes('↓')) {
    return 'text-destructive-500';
  }

  return 'text-success-500';
};

export const getLTV = () => {
  return calcLTV(
    currentPeriod.customerReport.newCustomers,
    currentPeriod.customerReport.newCustomers,
  );
};
