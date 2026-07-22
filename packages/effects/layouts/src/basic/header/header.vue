<script lang="ts" setup>
import { computed, useSlots } from 'vue';

import { useRefresh } from '@vben/hooks';
import { LockKeyhole, LogOut, RotateCw } from '@vben/icons';
import { $t } from '@vben/locales';
import { preferences, usePreferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';

import { useVbenModal } from '@vben-core/popup-ui';
import {
  VbenFullScreen,
  VbenIconButton,
  VbenTooltip,
} from '@vben-core/shadcn-ui';

import { useMagicKeys, whenever } from '@vueuse/core';

import {
  GlobalSearch,
  LanguageToggle,
  LockScreenModal,
  Notification,
  PreferencesButton,
  ThemeToggle,
  TimezoneButton,
} from '../../widgets';

interface Props {
  /**
   * 头像
   */
  avatar?: string;
  /**
   * Logo 主题
   */
  theme?: string;
  /**
   * 用户文本
   */
  text?: string;
}

defineOptions({
  name: 'LayoutHeader',
});

withDefaults(defineProps<Props>(), {
  avatar: '',
  theme: 'light',
  text: '',
});

const emit = defineEmits<{
  clearPreferencesAndLogout: [];
  logout: [];
  openLockScreen: [];
}>();

const REFERENCE_VALUE = 100;

const accessStore = useAccessStore();
const {
  globalLockScreenShortcutKey,
  globalLogoutShortcutKey,
  globalSearchShortcutKey,
  preferencesButtonPosition,
} = usePreferences();
const slots = useSlots();
const { refresh } = useRefresh();

const [LockModal, lockModalApi] = useVbenModal({
  connectedComponent: LockScreenModal,
});
const [LogoutModal, logoutModalApi] = useVbenModal({
  onConfirm() {
    handleSubmitLogout();
  },
});

function handleOpenLock() {
  lockModalApi.open();
}

function handleSubmitLock(lockScreenPassword: string) {
  lockModalApi.close();
  accessStore.lockScreen(lockScreenPassword);
}

function handleLogout() {
  logoutModalApi.open();
}

function handleSubmitLogout() {
  emit('logout');
  logoutModalApi.close();
}

// 快捷键
if (preferences.shortcutKeys.enable) {
  const keys = useMagicKeys();
  const lockKey = keys['Alt+KeyL'];
  const logoutKey = keys['Alt+KeyQ'];

  if (lockKey) {
    whenever(lockKey, () => {
      if (globalLockScreenShortcutKey?.value) {
        handleOpenLock();
      }
    });
  }

  if (logoutKey) {
    whenever(logoutKey, () => {
      if (globalLogoutShortcutKey?.value) {
        handleLogout();
      }
    });
  }
}

/**
 * 插槽列表类型
 */
type SlotItem = { index: number; name: string };

const rightSlots = computed(() => {
  const list: Array<SlotItem> = [];

  // 按 widget.order 顺序遍历，检查每个部件是否应在 header 中显示
  const widgetChecks: Record<string, { slotName: string; visible: boolean }> = {
    globalSearch: {
      visible:
        preferences.widget.globalSearch &&
        preferences.widget.globalSearchButtonPosition === 'header',
      slotName: 'global-search',
    },
    preferences: {
      visible: preferencesButtonPosition.value.header,
      slotName: 'preferences',
    },
    themeToggle: {
      visible:
        preferences.widget.themeToggle &&
        preferences.widget.themeToggleButtonPosition === 'header',
      slotName: 'theme-toggle',
    },
    languageToggle: {
      visible:
        preferences.widget.languageToggle &&
        preferences.widget.languageToggleButtonPosition === 'header',
      slotName: 'language-toggle',
    },
    timezone: {
      visible:
        preferences.widget.timezone &&
        preferences.widget.timezoneButtonPosition === 'header',
      slotName: 'timezone',
    },
    fullscreen: {
      visible:
        preferences.widget.fullscreen &&
        preferences.widget.fullscreenButtonPosition === 'header',
      slotName: 'fullscreen',
    },
    notification: {
      visible:
        preferences.widget.notification &&
        preferences.widget.notificationButtonPosition === 'header',
      slotName: 'notification',
    },
    lockScreenBtn: {
      visible:
        preferences.widget.lockScreen &&
        preferences.widget.lockScreenButtonPosition === 'header',
      slotName: 'lock-screen-btn',
    },
    logoutBtn: {
      visible: preferences.widget.logoutButtonPosition === 'header',
      slotName: 'logout-btn',
    },
    refresh: {
      visible:
        preferences.widget.refresh &&
        preferences.widget.refreshButtonPosition === 'header',
      slotName: 'refresh',
    },
  };

  for (const key of preferences.widget.order) {
    const check = widgetChecks[key];
    if (check?.visible) {
      list.push({ index: REFERENCE_VALUE + list.length, name: check.slotName });
    }
  }

  // 用户插槽（header-right-N）追加在后面
  Object.keys(slots).forEach((key) => {
    if (key.startsWith('header-right')) {
      const slotIndex = Number(key.split('-')[2]);
      const index = Number.isNaN(slotIndex) ? nextIndex(list) : slotIndex;
      list.push({ index, name: key });
    }
  });
  // 最后追加用户下拉框，若是索引值超过1000时则固定在1000（适配用户按钮不在最后的场景）
  const userDropdownIndex = Math.min(1000, nextIndex(list));
  list.push({ index: userDropdownIndex, name: 'user-dropdown' });
  // 按照索引排序，保证插槽顺序
  return list.toSorted((a, b) => a.index - b.index);
});

const leftSlots = computed(() => {
  const list: Array<SlotItem> = [];

  Object.keys(slots).forEach((key) => {
    // 适配插槽名称，例如第一个插槽名：header-left-1
    if (key.startsWith('header-left')) {
      // 取第三个占位的数字，若是第三个占位不是数字，则自动分配排序索引
      const slotIndex = Number(key.split('-')[2]);
      const index = Number.isNaN(slotIndex) ? nextIndex(list) : slotIndex;
      list.push({ index, name: key });
    }
  });
  // 按照索引排序，保证插槽顺序
  return list.toSorted((a, b) => a.index - b.index);
});

/**
 * 获取列表下一个索引值(用于排序)
 * @param list 列表
 */
function nextIndex(list: Array<SlotItem>) {
  const index =
    list.length > 0 ? Math.max(...list.map((item) => item.index)) : 0;
  return index + 1;
}

function clearPreferencesAndLogout() {
  emit('clearPreferencesAndLogout');
}
</script>

<template>
  <LockModal
    v-if="preferences.widget.lockScreen"
    :avatar="avatar"
    :text="text"
    @submit="handleSubmitLock"
  />

  <LogoutModal
    :cancel-text="$t('common.cancel')"
    :confirm-text="$t('common.confirm')"
    :fullscreen-button="false"
    :title="$t('common.prompt')"
    centered
    content-class="px-8 min-h-10"
    footer-class="border-none mb-3 mr-3"
    header-class="border-none"
  >
    {{ $t('ui.widgets.logoutTip') }}
  </LogoutModal>

  <template
    v-for="slot in leftSlots.filter((item) => item.index < REFERENCE_VALUE)"
    :key="slot.name"
  >
    <slot :name="slot.name">
      <template v-if="slot.name === 'refresh'">
        <VbenIconButton class="my-0 mr-1 rounded-md" @click="refresh">
          <RotateCw class="size-4" />
        </VbenIconButton>
      </template>
    </slot>
  </template>
  <div class="flex-center hidden lg:block">
    <slot name="breadcrumb"></slot>
  </div>
  <template
    v-for="slot in leftSlots.filter((item) => item.index > REFERENCE_VALUE)"
    :key="slot.name"
  >
    <slot :name="slot.name"></slot>
  </template>
  <div
    :class="`menu-align-${preferences.header.menuAlign}`"
    class="flex h-full min-w-0 flex-1 items-center"
  >
    <slot name="menu"></slot>
  </div>
  <div class="flex h-full min-w-0 shrink-0 items-center">
    <template v-for="slot in rightSlots" :key="slot.name">
      <slot :name="slot.name">
        <template v-if="slot.name === 'global-search'">
          <GlobalSearch
            :enable-shortcut-key="globalSearchShortcutKey"
            :menus="accessStore.accessMenus"
            class="mr-1 sm:mr-4"
          />
        </template>

        <template v-else-if="slot.name === 'preferences'">
          <VbenTooltip side="bottom">
            <template #trigger>
              <PreferencesButton
                class="mr-1"
                @clear-preferences-and-logout="clearPreferencesAndLogout"
              />
            </template>
            {{ $t('preferences.title') }}
          </VbenTooltip>
        </template>
        <template v-else-if="slot.name === 'theme-toggle'">
          <VbenTooltip side="bottom">
            <template #trigger>
              <ThemeToggle class="mt-0.5 mr-1" />
            </template>
            {{ $t('preferences.theme.title') }}
          </VbenTooltip>
        </template>
        <template v-else-if="slot.name === 'language-toggle'">
          <VbenTooltip side="bottom">
            <template #trigger>
              <LanguageToggle class="mr-1" />
            </template>
            {{ $t('preferences.widget.languageToggle') }}
          </VbenTooltip>
        </template>
        <template v-else-if="slot.name === 'fullscreen'">
          <VbenFullScreen
            class="mr-1"
            :tooltip="$t('preferences.widget.fullscreen')"
          />
        </template>
        <template v-else-if="slot.name === 'timezone'">
          <TimezoneButton class="mt-0.5 mr-1" />
        </template>
        <template v-else-if="slot.name === 'lock-screen-btn'">
          <VbenIconButton
            class="mr-1"
            :tooltip="$t('ui.widgets.lockScreen.title')"
            @click="handleOpenLock"
          >
            <LockKeyhole class="size-4" />
          </VbenIconButton>
        </template>
        <template v-else-if="slot.name === 'logout-btn'">
          <VbenIconButton
            class="mr-1"
            :tooltip="$t('common.logout')"
            @click="handleLogout"
          >
            <LogOut class="size-4" />
          </VbenIconButton>
        </template>
        <template v-else-if="slot.name === 'notification'">
          <VbenTooltip side="bottom">
            <template #trigger>
              <Notification class="mr-1" />
            </template>
            {{ $t('preferences.widget.notification') }}
          </VbenTooltip>
        </template>
        <template v-else-if="slot.name === 'refresh'">
          <VbenIconButton
            class="my-0 mr-1 rounded-md"
            :tooltip="$t('preferences.widget.refresh')"
            @click="refresh"
          >
            <RotateCw class="size-4" />
          </VbenIconButton>
        </template>
      </slot>
    </template>
  </div>
</template>
<style lang="scss" scoped>
.menu-align-start {
  --menu-align: start;
}

.menu-align-center {
  --menu-align: center;
}

.menu-align-end {
  --menu-align: end;
}
</style>
