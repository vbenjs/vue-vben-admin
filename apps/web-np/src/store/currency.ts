import { defineStore } from 'pinia';

import { formatMoney } from '#/shared/utils';

interface ICurrencyState {
  baseCurrency: string;
  date: string;
  rates: {
    currency: string;
    rate: number;
  }[];
}

export const useCurrencyStore = defineStore('np-currency', {
  actions: {
    setStates(newState: any) {
      this.baseCurrency = newState.base;
      this.date = newState.date;
      this.rates = newState.rates;
    },
    getDisplayRate(shopCurrency: string, appCurrency: string): any {
      const toRate = this.rates.find((rate) => rate.currency === appCurrency);
      const baseRate = this.rates.find(
        (rate) => rate.currency === shopCurrency,
      );

      if (!toRate || !baseRate) return '';

      const rate = toRate?.rate / baseRate?.rate;

      const toLabel = formatMoney(rate, null, 1, 8);

      return `1 ${baseRate.currency} = ${toLabel} ${toRate.currency}`;
    },
    getRate(baseCurrency: string, toCurrency: string): any {
      const baseRate = this.rates.find(
        (rate) => rate.currency === baseCurrency,
      );

      const toRate = this.rates.find((rate) => rate.currency === toCurrency);

      if (!baseRate || !toRate) return 1;

      return toRate?.rate / baseRate?.rate;
    },
  },

  state: (): ICurrencyState => ({
    baseCurrency: '',
    date: '',
    rates: [],
  }),
});
