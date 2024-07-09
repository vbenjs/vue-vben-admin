<script lang="ts" setup>
import type { NotificationItem } from '@vben/layouts';

import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { IcRoundCreditScore, MdiDriveDocument, MdiGithub } from '@vben/icons';
import { BasicLayout, Notification, UserDropdown } from '@vben/layouts';
import { openWindow } from '@vben/utils';
import { preferences } from '@vben-core/preferences';

import { $t } from '#/locales';
import { resetRoutes } from '#/router';
import { useAccessStore, useAppStore } from '#/store';

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
const { userInfo } = useAccessStore();
const router = useRouter();

async function handleLogout() {
  await appStore.resetAppState();
  resetRoutes();
  router.replace(LOGIN_PATH);
}

function handleNoticeClear() {
  notifications.value = [];
}

function handleMakeAll() {
  notifications.value.forEach((item) => (item.isRead = true));
}
</script>

<template>
  <BasicLayout @clear-preferences-and-logout="handleLogout">
    <template #user-dropdown>
      <UserDropdown
        :avatar="userInfo?.avatar ?? preferences.app.defaultAvatar"
        :menus="menus"
        :text="userInfo?.realName"
        description="ann.vben@gmail.com"
        tag-text="Pro"
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
  </BasicLayout>
</template>
