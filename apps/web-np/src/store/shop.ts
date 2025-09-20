import type { Channel } from 'pusher-js';

import { h } from 'vue';

import { useAccessStore } from '@vben/stores';

import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';
import Pusher from 'pusher-js';

import { shopUpdateSubscriptionInfo, updateGeneralSettings } from '#/api';
import { StateStatus, SubscriptionPlans } from '#/shared/constants';
import { redirectToExternal } from '#/shared/utils';
import NotificationMessage from '#/views/_core/notification-message.vue';

import { useCurrencyStore } from './currency';
import { useShopSettingStore } from './shop-settings';
import { useSystemStatisticStore } from './system-statistic';

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
  subscriptionId: string;
  subscriptionName: string;
  subscriptionPlan: string;
  timezone: string;
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

export interface INotification {
  type: string;
  title: string;
  message: string;
  alertType: string;
  reloadNotification: boolean;
  showAlert: boolean;
  url: null | string;
  urlType: null | string;
  urlName: null | string;
  readAt: null | string;
  createdAt: null | string;
}

export const useShopStore = defineStore('np-shop', {
  actions: {
    setStates(shop: any, state: any) {
      this.shop = {
        ...this.shop,
        ...shop,
        timezone:
          shop.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      this.state = state;

      this.initPusher();
    },
    updateSetting(values: any) {
      const currencyStore = useCurrencyStore();
      const shopSettingStore = useShopSettingStore();
      const { appCurrency } = values;

      return updateGeneralSettings(values).finally(() => {
        // Update the currency and rate in the shop store
        this.shop.currencyFromApp = appCurrency;
        shopSettingStore.cogsSourceDefault = values.cogsSource;

        this.shop.currencyRate = currencyStore.getRate(
          this.shop.currency,
          appCurrency,
        );
      });
    },
    updateSubscriptionInfo() {
      return shopUpdateSubscriptionInfo().then((res: any) => {
        this.shop = res.shop;
      });
    },
    redirectToPricing() {
      const url = `https://admin.shopify.com/store/${this.handleName}/charges/${import.meta.env.VITE_GLOB_SHOPIFY_APP_HANDLE}/pricing_plans`;
      redirectToExternal(url);
    },
    redirectToAdmin() {
      const url = `https://admin.shopify.com/store/${this.handleName}/apps/${import.meta.env.VITE_GLOB_SHOPIFY_APP_HANDLE}`;
      redirectToExternal(url);
    },
    redirectToOrderPage(orderId: any, newTab: boolean = true) {
      const url = `https://admin.shopify.com/store/${this.handleName}/orders/${orderId}`;
      redirectToExternal(url, newTab, true);
    },
    initPusher() {
      if (!this.pusherState.pusher) {
        const accessStore = useAccessStore();

        this.pusherState.pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
          cluster: import.meta.env.VITE_PUSHER_CLUSTER,
          forceTLS: true,
          authEndpoint: import.meta.env.VITE_PUSHER_AUTH_ENDPOINT,
          auth: {
            headers: {
              Authorization: `Bearer ${accessStore.accessToken}`,
            },
          },
        });
      }

      if (this.pusherState.channel) {
        this.pusherState.channel.unsubscribe();
        this.pusherState.channel = null;
      }

      this.pusherState.channel = this.pusherState.pusher.subscribe(
        this.pusherChannelName,
      );

      this.pusherState.channel.bind(
        this.pusherEventName,
        (payload: INotification) => {
          if (payload.type === 'OrderCalculatedNotification') {
            const systemStatisticStore = useSystemStatisticStore();

            systemStatisticStore.setCalcOrder(StateStatus.PROCESSED);
          }

          if (payload.showAlert) {
            notification[payload.alertType as 'success']({
              description: h(NotificationMessage, payload as any),
              message: payload.title,
              duration: 7,
            });
          }
        },
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
    handleName(): string {
      return this.shop.myshopifyDomain.replace('.myshopify.com', '');
    },
    pusherChannelName(): string {
      return `private-shop_id-${this.shop.id}`;
    },
    pusherChannel(): Channel {
      return this.pusherState.channel as any;
    },
    pusherEventName(): string {
      return 'broadcast_notification_event';
    },
    isOnboarding(): boolean {
      return this.state.onboard === ShopState.PROCESSING;
    },
    isFreeSubscription(): boolean {
      return this.shop.subscriptionPlan === SubscriptionPlans.FREE;
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
      subscriptionId: '',
      subscriptionName: '',
      subscriptionPlan: '',
      timezone: 'Asia/Tokyo',
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
