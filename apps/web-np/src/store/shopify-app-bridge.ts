import { createApp } from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import { getSessionToken } from '@shopify/app-bridge/utilities';
import { defineStore } from 'pinia';

export const useShopifyAppBridgeStore = defineStore('np-shopify-appbridge', {
  actions: {
    initAppBridge() {
      this.appBridge = createApp({
        apiKey: import.meta.env.VITE_GLOB_SHOPIFY_APP_KEY,
        host: new URLSearchParams(location.search).get('host') as string,
      });
    },
    getSessionToken() {
      if (!this.appBridge) {
        throw new Error('App Bridge is not initialized');
      }

      getSessionToken(this.appBridge).then((_) => {
        // You can use the token for further API calls or verification
      });
    },
    redirect(url: string, newTab: boolean = false) {
      if (!this.appBridge) {
        throw new Error('App Bridge is not initialized');
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
