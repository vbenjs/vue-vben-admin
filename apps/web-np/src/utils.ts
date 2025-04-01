import { $t } from '@vben/locales';
import { formatDate } from '@vben/utils';

import { findCurrency, format } from 'currency-formatter';
import dayjs from 'dayjs';

export { isShopifyEmbedded } from '@shopify/app-bridge/utilities';

export function calcPercentage(a: number, b: number) {
  if (!b) {
    return 0;
  }

  return ((a / b) * 100).toFixed(0);
}

export function calcGrossProfitMargin(item: any) {
  const grossProfit = Number(item.grossProfit);
  const netPayment = Number(item.netPayment);

  return calcPercentage(grossProfit, netPayment);
}

export function getCurrencySymbol(currency: string) {
  const e = findCurrency(currency);

  return e ? e.symbol : currency;
}

export function formatMoney(val: any, currency: any = null, rate = 1) {
  const amount = convertRate(val, rate);

  return format(amount, {
    code: currency,
    precision: 2,
    thousand: ',',
    decimal: '.',
  });
}

export function convertRate(val: any, rate = 1) {
  return val * rate;
}

export function toPercentage(rate: number): string {
  return format(rate * 100, { precision: 2 });
}

export function toRate(number: number): number {
  return number / 100;
}

export function numberWithCommas(x: any) {
  return x.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatReportDate(date: any, fmtDate = 'YYYY-MM-DD') {
  return formatDate(date, fmtDate);
}

export const getFieldExplain = (id: string) => {
  switch (id) {
    case 'cogs': {
      return $t('field-name.cogsExplain');
    }

    case 'customerFee': {
      return $t('field-name.customerFeeExplain');
    }

    case 'grossProfit': {
      return $t('field-name.grossProfitExplain');
    }

    case 'grossSales': {
      return $t('field-name.grossSalesExplain');
    }

    case 'netPayment': {
      return $t('field-name.netPaymentExplain');
    }

    case 'netProfit': {
      return $t('field-name.netProfitExplain');
    }

    case 'netProfitMargin': {
      return $t('field-name.netProfitMarginExplain');
    }

    case 'totalCustomCost': {
      return $t('field-name.totalCustomCostExplain');
    }

    default: {
      return '';
    }
  }
};

export const getDatePreset = (
  presets: string[],
  isDateRange: boolean = false,
) => {
  const datePresets = [
    {
      id: 'today',
      label: 'Today',
      value: dayjs().add(-1, 'd'),
    },
    {
      id: 'last7Days',
      label: 'Last 7 Days',
      value: dayjs().add(-7, 'd'),
    },
    {
      id: 'last14Days',
      label: 'Last 14 Days',
      value: dayjs().add(-14, 'd'),
    },
    {
      id: 'lastMonth',
      label: 'Last Month',
      value: dayjs().add(-1, 'month'),
    },
    {
      id: 'last2Months',
      label: 'Last 2 Months',
      value: dayjs().add(-2, 'month'),
    },
    {
      id: 'last3Months',
      label: 'Last 3 Months',
      value: dayjs().add(-3, 'month'),
    },
    {
      id: 'last6Months',
      label: 'Last 6 Months',
      value: dayjs().add(-6, 'month'),
    },
    {
      id: 'lastYear',
      label: 'Last year',
      value: dayjs().add(-1, 'year'),
    },
    {
      id: 'previousMonth',
      label: 'Previous Month',
      value: dayjs().add(-1, 'month').startOf('month'),
    },
    {
      id: 'thisMonth',
      label: 'This Month',
      value: dayjs().startOf('month'),
    },
    {
      id: 'thisYear',
      label: 'This Year',
      value: dayjs().startOf('year'),
    },
  ];

  const result = datePresets.filter((item) => presets.includes(item.id));

  if (isDateRange) {
    return result.map((item) => {
      let today = dayjs();

      if (item.id === 'previousMonth') {
        today = dayjs().add(-1, 'month').endOf('month');
      }

      return {
        label: item.label,
        value: [item.value, today],
      };
    });
  }

  return result;
};
