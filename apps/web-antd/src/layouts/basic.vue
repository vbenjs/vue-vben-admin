<script lang="ts" setup>
import type { NotificationItem } from '@vben/widgets';

import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { IcRoundCreditScore, MdiDriveDocument, MdiGithub } from '@vben/icons';
import { BasicLayout } from '@vben/layouts';
import { $t } from '@vben/locales';
import { openWindow } from '@vben/utils';
import { Notification, UserDropdown } from '@vben/widgets';
import { preferences } from '@vben-core/preferences';

import { resetRoutes } from '#/router';
import { useAppStore } from '#/store';

// https://avatar.vercel.sh/vercel.svg?text=Vaa
// https://avatar.vercel.sh/1
// https://avatar.vercel.sh/nextjs
// https://avatar.vercel.sh/satori
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
const router = useRouter();

async function handleLogout() {
  await appStore.resetAppState();
  resetRoutes();
  router.replace(LOGIN_PATH);
}

function handleNoticeClear() {
  notifications.value = [];
}
</script>

<template>
  <BasicLayout>
    <template #user-dropdown>
      <UserDropdown
        :avatar="preferences.app.defaultAvatar"
        :menus="menus"
        description="ann.vben@gmail.com"
        tag-text="Pro"
        text="Vben Admin"
        @logout="handleLogout"
      />
    </template>
    <template #notification>
      <Notification
        :notifications="notifications"
        dot
        @clear="handleNoticeClear"
      />
    </template>
  </BasicLayout>
</template>
