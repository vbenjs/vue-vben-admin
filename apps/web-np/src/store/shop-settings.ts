import { cloneDeep } from '@vben/utils';

import { defineStore } from 'pinia';

import {
  removeRegion,
  shopToggleMailReport,
  shopToggleShowChatPopup,
  updateRegion,
  updateTransactionFees,
} from '#/api';
import { defaultRegionUUID } from '#/shared/constants';
import { crispDisplay } from '#/shared/crisp';

import { ECogsSource } from './../shared/constants';

export interface ITransactionFee {
  externalFeePercentage: number;
  fixedFee: number;
  handleName: string;
  name: string;
  percentageFee: number;
  uuid: string;
}

export interface IRegion {
  countries: string[];
  name: string;
  shippingCostLevel: any;
  shippingCostPrice: any;
  uuid: string;
}

interface IShopSettings {
  cogsRate: number;
  cogsSourceDefault: ECogsSource;
  handlingFees: any;
  regions: IRegion[];
  transactionFees: ITransactionFee[];
  mailWeeklyReport: boolean;
  mailMonthlyReport: boolean;
  showChatPopup: boolean;
}

export const useShopSettingStore = defineStore('np-shop-setting', {
  actions: {
    setStates(settings: any) {
      this.cogsRate = settings.cogsRate;
      this.cogsSourceDefault = settings.cogsSourceDefault;
      this.handlingFees = settings.handlingFees;
      this.regions = settings.regions;
      this.transactionFees = settings.transactionFees;
      this.mailWeeklyReport = settings.mailWeeklyReport;
      this.mailMonthlyReport = settings.mailMonthlyReport;
      this.showChatPopup = settings.showChatPopup;
    },
    async setTransactionsFees(transactionFees: ITransactionFee[]) {
      const payload = cloneDeep(transactionFees).map((fee) => {
        fee.percentageFee = fee.percentageFee / 100;
        fee.externalFeePercentage = fee.externalFeePercentage / 100;

        return fee;
      });

      return updateTransactionFees(payload).then((_) => {
        this.transactionFees = payload;
      });
    },
    async setRegion(region: any) {
      return updateRegion(region).then((res) => {
        this.regions = res;
        return res;
      });
    },
    async removeRegion(uuid: any) {
      return removeRegion(uuid).then((res) => {
        this.regions = res;
        return res;
      });
    },
    async toggleMailReport(status: boolean, type: string) {
      return shopToggleMailReport({
        type,
        status,
      }).then(() => {
        this.mailWeeklyReport = status;
      });
    },
    async toggleChatPopup() {
      this.showChatPopup = !this.showChatPopup;

      crispDisplay(this.showChatPopup);

      return shopToggleShowChatPopup({
        showChatPopup: this.showChatPopup,
      });
    },
    getZoneName(uuid: any) {
      return this.regions.find((region) => region.uuid === uuid)?.name ?? '';
    },
  },

  getters: {
    defaultRegion(): IRegion {
      return this.regions.find(
        (region) => region.uuid === defaultRegionUUID,
      ) as IRegion;
    },
  },

  state: (): IShopSettings => ({
    cogsRate: 0,
    cogsSourceDefault: ECogsSource.SHOPIFY,
    handlingFees: {},
    regions: [],
    transactionFees: [],
    mailWeeklyReport: true,
    mailMonthlyReport: true,
    showChatPopup: false,
  }),
});
