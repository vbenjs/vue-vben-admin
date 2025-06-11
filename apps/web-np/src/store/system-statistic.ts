import { defineStore } from 'pinia';

import { getShopStatistic } from '#/api';
import { StateStatus } from '#/shared/constants';

export const useSystemStatisticStore = defineStore('np-system-statistic', {
  actions: {
    loadData(force: boolean = false) {
      this.loading = true;

      getShopStatistic({ force })
        .then((data) => {
          this.calcOrder = data.calcOrder;
          this.syncShopifyOrder = data.syncShopifyOrder;
          this.syncShopifyProduct = data.syncShopifyProduct;
          this.syncShopifyCustomer = data.syncShopifyCustomer;
          this.loading = false;
          return data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    setCalcOrder(status: StateStatus) {
      this.calcOrder = status;
    },
  },

  getters: {
    isProcessing(): boolean {
      return (
        this.calcOrder !== StateStatus.PROCESSED ||
        this.syncShopifyOrder !== StateStatus.PROCESSED ||
        this.syncShopifyProduct !== StateStatus.PROCESSED ||
        this.syncShopifyCustomer !== StateStatus.PROCESSED
      );
    },
  },

  state: () => ({
    loading: false,
    calcOrder: StateStatus.PENDING,
    syncShopifyOrder: StateStatus.PENDING,
    syncShopifyProduct: StateStatus.PENDING,
    syncShopifyCustomer: StateStatus.PENDING,
  }),
});
