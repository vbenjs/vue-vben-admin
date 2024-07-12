<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { IcRoundCreditScore, MdiDriveDocument, MdiGithub } from '@vben/icons';
import {
  BasicLayout,
  LockScreen,
  Notification,
  NotificationItem,
  UserDropdown,
} from '@vben/layouts';
import { AuthenticationLoginExpiredModal } from '@vben/universal-ui';
import { openWindow } from '@vben/utils';
import { preferences } from '@vben-core/preferences';

import { $t } from '#/locales';
import { resetRoutes } from '#/router';
import { storeToRefs, useAccessStore, useAppStore } from '#/store';

const notifications = ref<NotificationItem[]>([
  {
    avatar: 'https://avatar.vercel.sh/vercel.svg?text=VB',
    date: '3小时前',
    isRead: true,
    message: '描述信息描述信息描述信息',
    title: '收到了 14 份新周报',
  },
  {
    avatar: 'https://avatar.vercel.sh/1',
    date: '刚刚',
    isRead: false,
    message: '描述信息描述信息描述信息',
    title: '朱偏右 回复了你',
  },
  {
    avatar: 'https://avatar.vercel.sh/1',
    date: '2024-01-01',
    isRead: false,
    message: '描述信息描述信息描述信息',
    title: '曲丽丽 评论了你',
  },
  {
    avatar: 'https://avatar.vercel.sh/satori',
    date: '1天前',
    isRead: false,
    message: '描述信息描述信息描述信息',
    title: '代办提醒',
  },
]);

const showDot = computed(() =>
  notifications.value.some((item) => !item.isRead),
);

const menus = computed(() => [
  {
    handler: () => {
      openWindow('https://github.com/vbenjs/vue-vben-admin', {
        target: '_blank',
      });
    },
    icon: MdiDriveDocument,
    text: $t('widgets.document'),
  },
  {
    handler: () => {
      openWindow('https://github.com/vbenjs/vue-vben-admin', {
        target: '_blank',
      });
    },
    icon: MdiGithub,
    text: 'GitHub',
  },
  {
    handler: () => {
      openWindow('https://github.com/vbenjs/vue-vben-admin/issues', {
        target: '_blank',
      });
    },
    icon: IcRoundCreditScore,
    text: $t('widgets.qa'),
  },
]);

const appStore = useAppStore();
const accessStore = useAccessStore();

const { isLockScreen, lockScreenPassword } = storeToRefs(appStore);
const {
  loading: loginLoading,
  openLoginExpiredModal,
  userInfo,
} = storeToRefs(accessStore);

const avatar = computed(() => {
  return userInfo.value?.avatar ?? preferences.app.defaultAvatar;
});

const router = useRouter();

async function handleLogout() {
  appStore.resetAppState();
  appStore.unlockScreen();
  resetRoutes();
  await router.replace(LOGIN_PATH);
}

function handleNoticeClear() {
  notifications.value = [];
}

function handleMakeAll() {
  notifications.value.forEach((item) => (item.isRead = true));
}

function handleLockScreen(password: string) {
  appStore.lockScreen(password);
}
</script>

<template>
  <BasicLayout @clear-preferences-and-logout="handleLogout">
    <template #user-dropdown>
      <UserDropdown
        :avatar
        :menus
        :text="userInfo?.realName"
        description="ann.vben@gmail.com"
        tag-text="Pro"
        @lock-screen="handleLockScreen"
        @logout="handleLogout"
      />
    </template>
    <template #notification>
      <Notification
        :dot="showDot"
        :notifications="notifications"
        @clear="handleNoticeClear"
        @make-all="handleMakeAll"
      />
    </template>
    <template #extra>
      <AuthenticationLoginExpiredModal
        v-model:open="openLoginExpiredModal"
        :loading="loginLoading"
        password-placeholder="123456"
        username-placeholder="vben"
        @submit="accessStore.authLogin"
      />
    </template>
    <template #lock-screen>
      <LockScreen
        v-if="isLockScreen"
        :avatar
        :cached-password="lockScreenPassword"
        @to-login="handleLogout"
        @unlock="appStore.unlockScreen"
      />
    </template>
  </BasicLayout>
</template>
