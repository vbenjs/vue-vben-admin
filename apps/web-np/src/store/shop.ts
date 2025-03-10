import type { Channel } from 'pusher-js';

import { defineStore } from 'pinia';
import Pusher from 'pusher-js';

import { updateGeneralSettings } from '#/api';

import { useCurrencyStore } from './currency';

enum ShopState {
  PENDING = 'pending',
  PROCESSED = 'processed',
  PROCESSING = 'processing',
}

interface IShop {
  id: string;
  countryCode: string;
  countryName: string;
  currency: string;
  currencySymbol: string;
  currencyFromApp: string;
  currencyRate: number;
  domain: string;
  myshopifyDomain: string;
  plan: string;
}

interface IShopState {
  product_sync: ShopState;
  order_sync: ShopState;
  customer_sync: ShopState;
  onboard: ShopState;
  cogs_config: ShopState;
  handling_fees_config: ShopState;
  shipping_fee_config: ShopState;
  transaction_fee_config: ShopState;
}

interface IPusherState {
  pusher: null | Pusher;
  channel: Channel | null;
}

export const useShopStore = defineStore('np-shop', {
  actions: {
    setStates(shop: any, state: any) {
      this.shop = shop;
      this.state = state;

      this.initPusher();
    },
    updateAppCurrency(appCurrency: string) {
      const currencyStore = useCurrencyStore();

      return updateGeneralSettings({ appCurrency }).finally(() => {
        // Update the currency and rate in the shop store
        this.shop.currencyFromApp = appCurrency;
        this.shop.currencyRate = currencyStore.getRate(
          this.shop.currency,
          appCurrency,
        );
      });
    },
    initPusher() {
      if (!this.pusherState.pusher) {
        this.pusherState.pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
          cluster: import.meta.env.VITE_PUSHER_CLUSTER,
          forceTLS: true,
        });
      }

      if (this.pusherState.channel) {
        this.pusherState.channel.unsubscribe();
        this.pusherState.channel = null;
      }

      this.pusherState.channel = this.pusherState.pusher.subscribe(
        this.channelName,
      );
    },
    disconnectPusher() {
      this.pusherState.channel?.unsubscribe();
      this.pusherState.channel = null;

      this.pusherState.pusher?.disconnect();
      this.pusherState.pusher = null;
    },
  },

  getters: {
    channelName(): string {
      return import.meta.env.VITE_PUSHER_CHANNEL_PREFIX + this.shop.id;
    },
    channel(): Channel | null {
      return this.pusherState.channel;
    },
    isOnboarding(): boolean {
      return this.state.onboard === ShopState.PROCESSING;
    },
  },

  state: (): { pusherState: IPusherState; shop: IShop; state: IShopState } => ({
    shop: {
      id: '',
      countryCode: '',
      countryName: '',
      currency: '',
      currencySymbol: '',
      currencyFromApp: '',
      currencyRate: 1,
      domain: '',
      myshopifyDomain: '',
      plan: '',
    },
    state: {
      product_sync: ShopState.PROCESSED,
      order_sync: ShopState.PROCESSED,
      customer_sync: ShopState.PROCESSED,
      onboard: ShopState.PROCESSED,
      cogs_config: ShopState.PROCESSED,
      handling_fees_config: ShopState.PROCESSED,
      shipping_fee_config: ShopState.PROCESSED,
      transaction_fee_config: ShopState.PROCESSED,
    },
    pusherState: {
      pusher: null,
      channel: null,
    },
  }),
});
