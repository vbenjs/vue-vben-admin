import type { Recordable } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import {
  generateAuthUrl,
  getAccessCodesApi,
  getUserInfoApi,
  loginApiViaShopifySession,
  logoutApi,
} from '#/api';
import { $t } from '#/locales';
import { DefaultRoutes } from '#/shared/constants';
import { crispDisplay, crispSetShopInfo } from '#/shared/crisp';

import { useCurrencyStore } from './currency';
import { useShopStore } from './shop';
import { useShopSettingStore } from './shop-settings';
import { useShopifyAppBridgeStore } from './shopify-app-bridge';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const shopStore = useShopStore();
  const shopSettingStore = useShopSettingStore();
  const currencyStore = useCurrencyStore();

  const router = useRouter();

  const loginLoading = ref(false);

  async function authInstall(params: Recordable<any>) {
    loginLoading.value = true;
    window.location.href = generateAuthUrl(params);
  }

  async function authLoginViaShopifySession(params: Recordable<any>) {
    const shopifyAppBridgeStore = useShopifyAppBridgeStore();

    // Verify Shopify token
    shopifyAppBridgeStore.getSessionToken();

    loginLoading.value = true;
    const { accessToken } = await loginApiViaShopifySession(params);

    return await authLoginViaToken(accessToken);
  }

  async function authLoginViaToken(accessToken: string) {
    loginLoading.value = true;
    accessStore.setAccessToken(accessToken);

    const [fetchUserInfoResult, accessCodes] = await Promise.all([
      fetchUserInfo(),
      getAccessCodesApi(),
    ]);

    const userInfo: any = fetchUserInfoResult;

    accessStore.setAccessCodes(accessCodes);

    if (accessStore.loginExpired) {
      accessStore.setLoginExpired(false);
    } else {
      const url = userInfo.homePath || DefaultRoutes.HOME;
      await router.push(url);
    }

    if (userInfo?.realName && !shopStore.isOnboarding) {
      notification.success({
        description: `${$t('authentication.loginSuccessDesc')}: ${userInfo?.realName}`,
        duration: 3,
        message: $t('authentication.loginSuccess'),
      });
    }
  }

  async function logout(redirect: boolean = true) {
    await logoutApi();

    resetAllStores();
    accessStore.setLoginExpired(false);

    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    });
  }

  async function fetchUserInfo() {
    const res = await getUserInfoApi();

    // Update stores
    userStore.setUserInfo(res as any);
    currencyStore.setStates(res.currencies);
    shopStore.setStates(
      {
        ...res.shop,
        id: res.userId,
        currencyRate: currencyStore.getRate(
          res.shop.currency,
          res.shop.currencyFromApp,
        ),
      },
      res.state,
    );
    shopSettingStore.setStates(res.settings);

    crispSetShopInfo(res);
    crispDisplay(shopStore.isOnboarding, false);

    return res;
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authInstall,
    authLoginViaShopifySession,
    authLoginViaToken,
    fetchUserInfo,
    loginLoading,
    logout,
  };
});
