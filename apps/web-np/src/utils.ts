import { formatDate } from '@vben/utils';

import { findCurrency, format } from 'currency-formatter';

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
  return format(val * rate, {
    code: currency,
    precision: 2,
    thousand: ',',
    decimal: '.',
  });
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

export function formatReportDate(date: any, fmtDate = 'MMM DD, YYYY') {
  return formatDate(date, fmtDate);
}
