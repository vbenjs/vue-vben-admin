<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';

import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
import { useWatermark } from '@vben/hooks';
import { BasicLayout, LockScreen, UserDropdown } from '@vben/layouts';
import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';

import {
  authInNewTab,
  isShopifyEmbedded,
  redirectToExternal,
} from '#/shared/utils';
import { useAuthStore, useShopStore } from '#/store';
import LoginForm from '#/views/_core/authentication/login.vue';

import Chat from './chat.vue';
import Notification from './notification.vue';
import ShopStatistic from './shop-statistic.vue';

const shopStore = useShopStore();
const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();
const router = useRouter();
const { destroyWatermark, updateWatermark } = useWatermark();

const menus = computed(() => {
  const profileMenus = [];

  if (isShopifyEmbedded()) {
    profileMenus.push({
      handler: () => {
        authInNewTab();
      },
      icon: 'ant-design:fullscreen-outlined',
      text: 'Open Fullscreen',
    });
  } else {
    profileMenus.push({
      handler: () => {
        shopStore.redirectToAdmin();
      },
      icon: 'ic:baseline-shopify',
      text: 'Shopify admin page',
    });
  }

  profileMenus.push(
    {
      handler: () => {
        const url = `https://${shopStore.shop.myshopifyDomain}`;
        redirectToExternal(url);
      },
      icon: 'ic:baseline-shopify',
      text: 'Shopify store',
    },
    {
      handler: () => {
        const url = `https://apps.shopify.com/${import.meta.env.VITE_GLOB_SHOPIFY_APP_HANDLE}`;
        redirectToExternal(url);
      },
      icon: 'ic:baseline-shopify',
      text: 'Shopify app page',
    },
    {
      handler: () => {
        router.push({
          name: 'settings.general',
        });
      },
      icon: 'codicon:settings',
      text: 'Profile settings',
    },
    // NOT DELETE THIS BLOCK
    // {
    //   handler: shopStore.redirectToPricing,
    //   icon: 'ant-design:dollar-circle-twotone',
    //   text: 'Pricing plans',
    // },
  );

  return profileMenus;
});

const avatar = computed(() => {
  return '/static/images/shopify-header-logo.png';
});

async function handleLogout() {
  await authStore.logout(false);
}

watch(
  () => preferences.app.watermark,
  async (enable) => {
    if (enable) {
      await updateWatermark({
        content: `${userStore.userInfo?.username}`,
      });
    } else {
      destroyWatermark();
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <BasicLayout @clear-preferences-and-logout="handleLogout">
    <template #user-dropdown>
      <UserDropdown
        :avatar
        :menus="menus as any"
        :text="userStore.userInfo?.username"
        :description="shopStore.shop.domain ?? shopStore.shop.myshopifyDomain"
        :tag-text="shopStore.shop.subscriptionName"
        @logout="handleLogout"
      />
    </template>
    <template #notification>
      <ShopStatistic />
      <Notification />
      <Chat />
    </template>
    <template #extra>
      <AuthenticationLoginExpiredModal
        v-model:open="accessStore.loginExpired"
        :avatar
      >
        <LoginForm />
      </AuthenticationLoginExpiredModal>
    </template>
    <template #lock-screen>
      <LockScreen :avatar @to-login="handleLogout" />
    </template>
  </BasicLayout>
</template>
