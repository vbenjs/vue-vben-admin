import { createApp } from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import {
  getSessionToken,
  isShopifyEmbedded,
} from '@shopify/app-bridge/utilities';
import { defineStore } from 'pinia';

export const useShopifyAppBridgeStore = defineStore('np-shopify-appbridge', {
  actions: {
    initAppBridge() {
      if (!isShopifyEmbedded() || this.appBridge) {
        return;
      }

      try {
        const app = createApp({
          apiKey: import.meta.env.VITE_GLOB_SHOPIFY_APP_KEY,
          host: new URLSearchParams(location.search).get('host') as string,
        });

        this.appBridge = app;
      } catch {}
    },
    getSessionToken() {
      if (!this.appBridge) {
        return;
      }

      getSessionToken(this.appBridge).then((_) => {
        // You can use the token for further API calls or verification
      });
    },
    redirect(url: string, newTab: boolean = false) {
      if (!this.appBridge) {
        window.open(url, '_blank');
        return;
      }

      const redirect = Redirect.create(this.appBridge);

      redirect.dispatch(Redirect.Action.REMOTE, {
        url,
        newContext: newTab,
      });
    },
  },

  state: () => ({
    appBridge: null as any,
  }),
});
