<script lang="ts" setup>
import type { NotificationItem } from '@vben/layouts';

import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
import { useWatermark } from '@vben/hooks';
import { BookOpenText } from '@vben/icons';
import {
  BasicLayout,
  LockScreen,
  Notification,
  UserDropdown,
} from '@vben/layouts';
import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';

import {
  ElButton,
  ElDialog,
  ElDrawer,
  ElMessage,
  ElMessageBox,
  ElTag,
} from 'element-plus';
import { storeToRefs } from 'pinia';

import ChangePasswordForm from '#/components/ChangePasswordForm.vue';
import { $t } from '#/locales';
import { useAuthStore, useNotificationStore } from '#/store';
import LoginForm from '#/views/_core/authentication/login.vue';

const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();
const notificationStore = useNotificationStore();
const { destroyWatermark, updateWatermark } = useWatermark();
const router = useRouter();

const { currentNotification, hasUnread, previewNotifications } =
  storeToRefs(notificationStore);
const showDot = hasUnread;

const notificationDrawerVisible = ref(false);

// 修改密码对话框状态
const changePasswordDialogVisible = ref(false);
const changePasswordFormRef = ref();

const menus = computed(() => [
  {
    handler: () => {
      ElMessage.success('暂未实现');
    },
    icon: BookOpenText,
    text: $t('ui.widgets.personSetting'),
  },
  {
    handler: () => {
      handleOpenChangePassword();
    },
    icon: BookOpenText,
    text: $t('ui.widgets.changePassword'),
  },
  // {
  //   handler: () => {
  //     openWindow(VBEN_DOC_URL, {
  //       target: '_blank',
  //     });
  //   },
  //   icon: BookOpenText,
  //   text: $t('ui.widgets.document'),
  // },
  // {
  //   handler: () => {
  //     openWindow(VBEN_GITHUB_URL, {
  //       target: '_blank',
  //     });
  //   },
  //   icon: MdiGithub,
  //   text: 'GitHub',
  // },
  // {
  //   handler: () => {
  //     openWindow(`${VBEN_GITHUB_URL}/issues`, {
  //       target: '_blank',
  //     });
  //   },
  //   icon: CircleHelp,
  //   text: $t('ui.widgets.qa'),
  // },
]);

const avatar = computed(() => {
  return userStore.userInfo?.avatar ?? preferences.app.defaultAvatar;
});

async function handleLogout() {
  await authStore.logout(false);
}

async function handleNoticeClear() {
  try {
    await ElMessageBox.confirm('确认清空所有通知吗？', '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    notificationStore.clearNotifications();
    ElMessage.success('通知已清空');
  } catch {
    // ignore cancel action
  }
}

function handleMakeAll() {
  void notificationStore.markAllAsRead();
}

function handleNotificationRead(item: NotificationItem) {
  if (!item.id) return;

  void notificationStore.markAsRead(item.id);
  notificationStore.selectNotification(item.id);
  notificationDrawerVisible.value = true;
}

function handleViewAllNotifications() {
  notificationDrawerVisible.value = false;
  notificationStore.selectNotification(null);
  router.push({ name: 'NotificationsCenter' }).catch(() => undefined);
}

function handleNotificationDrawerClose() {
  notificationDrawerVisible.value = false;
  notificationStore.selectNotification(null);
}

// 打开修改密码对话框
function handleOpenChangePassword() {
  changePasswordDialogVisible.value = true;
}

// 密码修改成功
function handlePasswordChangeSuccess() {
  changePasswordDialogVisible.value = false;
  ElMessage.success('密码修改成功');
}

// 取消修改密码
function handlePasswordChangeCancel() {
  changePasswordDialogVisible.value = false;
  // 重置表单
  changePasswordFormRef.value?.resetForm();
}

// 用户信息就绪后加载通知列表
watch(
  () => userStore.userInfo?.userId,
  (userId) => {
    if (userId) {
      void notificationStore.refreshNotifications();
      notificationStore.connectSse();
    } else {
      notificationStore.disconnectSse();
      notificationStore.stopPolling();
    }
  },
  { immediate: true },
);
watch(
  () => preferences.app.watermark,
  async (enable) => {
    if (enable) {
      await updateWatermark({
        content: `${userStore.userInfo?.username} - ${userStore.userInfo?.displayName}`,
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
        :menus
        :text="userStore.userInfo?.displayName"
        description=""
        tag-text=""
        @logout="handleLogout"
      />
    </template>
    <template #notification>
      <Notification
        :dot="showDot"
        :notifications="previewNotifications"
        @clear="handleNoticeClear"
        @make-all="handleMakeAll"
        @read="handleNotificationRead"
        @view-all="handleViewAllNotifications"
      />
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

  <!-- 修改密码对话框 -->
  <ElDialog
    v-model="changePasswordDialogVisible"
    title="修改密码"
    width="500px"
    :close-on-click-modal="false"
    @close="handlePasswordChangeCancel"
  >
    <ChangePasswordForm
      ref="changePasswordFormRef"
      @success="handlePasswordChangeSuccess"
      @cancel="handlePasswordChangeCancel"
    />
  </ElDialog>

  <ElDrawer
    v-model="notificationDrawerVisible"
    :title="currentNotification?.title ?? $t('page.notifications.drawerTitle')"
    size="30%"
    @close="handleNotificationDrawerClose"
  >
    <template v-if="currentNotification">
      <div class="notification-detail">
        <div class="notification-detail__meta">
          <ElTag effect="plain" size="small">
            {{
              $t(`page.notifications.category.${currentNotification.category}`)
            }}
          </ElTag>
          <span class="notification-detail__date">
            {{ currentNotification.date }}
          </span>
        </div>
        <p class="notification-detail__message">
          {{ currentNotification.message }}
        </p>
        <p class="notification-detail__content">
          {{ currentNotification.content }}
        </p>
        <ElButton link type="primary" @click="handleViewAllNotifications">
          {{ $t('page.notifications.openCenter') }}
        </ElButton>
      </div>
    </template>
    <template v-else>
      <div class="notification-detail__empty">
        {{ $t('page.notifications.emptySelection') }}
      </div>
    </template>
  </ElDrawer>
</template>

<style scoped>
.notification-detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-detail__meta {
  display: flex;
  gap: 12px;
  align-items: center;
  color: var(--el-text-color-regular);
}

.notification-detail__date {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.notification-detail__message {
  font-weight: 500;
}

.notification-detail__content {
  line-height: 1.6;
  color: var(--el-text-color-regular);
}

.notification-detail__empty {
  padding: 24px 0;
  color: var(--el-text-color-secondary);
  text-align: center;
}
</style>
