import { $t } from '@vben/locales';
import { useAccessStore } from '@vben/stores';

import { isShopifyEmbedded } from '@shopify/app-bridge/utilities';
import { findCurrency, format } from 'currency-formatter';

import { router } from '#/router';
import { useShopifyAppBridgeStore } from '#/store/shopify-app-bridge';

import { adType } from './constants';
import { dayjsInGMT } from './dayjs';

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

export function formatTitle(title: string) {
  return title
    .replaceAll('_', ' ')
    .replaceAll(/\b\w/g, (l: any) => l.toUpperCase());
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
  return dayjsInGMT(date).format(fmtDate);
}

export const getFieldExplain = (id: string) => {
  switch (id) {
    case 'cogs': {
      return $t('field-name.cogsExplain');
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
      value: dayjsInGMT().add(-1, 'd'),
    },
    {
      id: 'last7Days',
      label: 'Last 7 Days',
      value: dayjsInGMT().add(-7, 'd'),
    },
    {
      id: 'last14Days',
      label: 'Last 14 Days',
      value: dayjsInGMT().add(-14, 'd'),
    },
    {
      id: 'lastMonth',
      label: 'Last 30 Days',
      value: dayjsInGMT().add(-30, 'd'),
    },
    {
      id: 'last2Months',
      label: 'Last 60 Days',
      value: dayjsInGMT().add(-60, 'd'),
    },
    {
      id: 'last3Months',
      label: 'Last 90 Days',
      value: dayjsInGMT().add(-90, 'd'),
    },
    {
      id: 'last6Months',
      label: 'Last 180 Days',
      value: dayjsInGMT().add(-180, 'd'),
    },
    {
      id: 'lastYear',
      label: 'Last 365 Days',
      value: dayjsInGMT().add(-365, 'd'),
    },
    {
      id: 'previousMonth',
      label: 'Previous Month',
      value: dayjsInGMT().add(-1, 'month').startOf('month'),
    },
    {
      id: 'thisMonth',
      label: 'This Month',
      value: dayjsInGMT().startOf('month'),
    },
    {
      id: 'thisYear',
      label: 'This Year',
      value: dayjsInGMT().startOf('year'),
    },
  ];

  const result = datePresets.filter((item) => presets.includes(item.id));

  if (isDateRange) {
    return result.map((item) => {
      let today = dayjsInGMT();

      if (item.id === 'previousMonth') {
        today = dayjsInGMT().add(-1, 'month').endOf('month');
      }

      return {
        label: item.label,
        value: [item.value, today],
      };
    });
  }

  return result;
};

export const redirect = (name: string) => {
  router.push({
    name,
  });
};

export const redirectToPath = (path: string) => {
  router.push(path);
};

export const redirectToExternal = (url: string, newTab: boolean = false) => {
  if (isShopifyEmbedded()) {
    const shopifyAppBridgeStore = useShopifyAppBridgeStore();
    shopifyAppBridgeStore.redirect(url, newTab);
    return;
  }

  if (newTab) {
    window.open(url, '_blank');
    return;
  }

  window.location.href = url;
};

export const authInNewTab = () => {
  const accessStore = useAccessStore();
  const url = `${window.location.origin}/auth/token?token=${accessStore.accessToken}`;

  redirectToExternal(url);
};

export const getAdsIcon = (type: string) => {
  const val = adType.find((item) => item.value === type)?.icon;
  return val || 'ant-design:question-circle-outlined';
};
