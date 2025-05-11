import { defineStore } from 'pinia';
import { getPurchaseByIdApi } from '#/api';
export const usePurchaseStore = defineStore('purchase', {
  state: () => ({
    purchaseId: 0,
    // 是否刷新
    refreshView: false,
  }),
  actions: {
    async getPurchaseData() {
      const data = await getPurchaseByIdApi(this.purchaseId);
      this.purchaseId = 0;
      return data;
    },
  },
});
