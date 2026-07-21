<script setup lang="ts">
import type { Component } from 'vue';

import type { AnyFunction } from '@vben/types';

import { computed, ref, useTemplateRef, watch } from 'vue';

import { SUPPORT_LANGUAGES } from '@vben/constants';
import { useHoverToggle, useRefresh } from '@vben/hooks';
import {
  Languages,
  LockKeyhole,
  LogOut,
  RotateCw,
  Search,
  Settings,
} from '@vben/icons';
import { $t, loadLocaleMessages } from '@vben/locales';
import {
  preferences,
  updatePreferences,
  usePreferences,
} from '@vben/preferences';
import { useAccessStore } from '@vben/stores';
import { isWindowsOs } from '@vben/utils';

import { useVbenModal } from '@vben-core/popup-ui';
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  VbenAvatar,
  VbenFullScreen,
  VbenIcon,
  VbenIconButton,
} from '@vben-core/shadcn-ui';

import { useMagicKeys, whenever } from '@vueuse/core';

import { GlobalSearch } from '../global-search';
import { LockScreenModal } from '../lock-screen';
import { Notification } from '../notification';
import { Preferences } from '../preferences';
import { ThemeToggle } from '../theme-toggle';
import { TimezoneButton } from '../timezone';

interface Props {
  /**
   * 头像
   */
  avatar?: string;
  /**
   * @zh_CN 描述
   */
  description?: string;
  /**
   * 菜单数组
   */
  menus?: Array<{
    handler: AnyFunction;
    icon?: Component | Function | string;
    text: string;
  }>;

  /**
   * 标签文本
   */
  tagText?: string;
  /**
   * 文本
   */
  text?: string;
  /** 触发方式 */
  trigger?: 'both' | 'click' | 'hover';
  /** hover触发时，延迟响应的时间 */
  hoverDelay?: number;
}

defineOptions({
  name: 'UserDropdown',
});

const props = withDefaults(defineProps<Props>(), {
  avatar: '',
  description: '',
  menus: () => [],
  tagText: '',
  text: '',
  trigger: 'click',
  hoverDelay: 500,
});

const emit = defineEmits<{ clearPreferencesAndLogout: []; logout: [] }>();

const {
  globalLogoutShortcutKey,
  globalLockScreenShortcutKey,
  globalSearchShortcutKey,
  preferencesButtonPosition,
} = usePreferences();
const { refresh } = useRefresh();
const accessStore = useAccessStore();
const [LockModal, lockModalApi] = useVbenModal({
  connectedComponent: LockScreenModal,
});
const [LogoutModal, logoutModalApi] = useVbenModal({
  onConfirm() {
    handleSubmitLogout();
  },
});

const refTrigger = useTemplateRef('refTrigger');
const refContent = useTemplateRef('refContent');
const refPreferences = useTemplateRef('refPreferences');
const refGlobalSearch = useTemplateRef('refGlobalSearch');
const [openPopover, hoverWatcher] = useHoverToggle(
  [refTrigger, refContent],
  () => props.hoverDelay,
);

watch(
  () => props.trigger === 'hover' || props.trigger === 'both',
  (val) => {
    if (val) {
      hoverWatcher.enable();
    } else {
      hoverWatcher.disable();
    }
  },
  {
    immediate: true,
  },
);

const showLockInDropdown = computed(
  () =>
    preferences.widget.lockScreen &&
    preferences.widget.lockScreenButtonPosition === 'user-dropdown',
);

const showLogoutInDropdown = computed(
  () => preferences.widget.logoutButtonPosition === 'user-dropdown',
);

const showGlobalSearchInDropdown = computed(
  () =>
    preferences.widget.globalSearch &&
    preferences.widget.globalSearchButtonPosition === 'user-dropdown',
);

const showThemeToggleInDropdown = computed(
  () =>
    preferences.widget.themeToggle &&
    preferences.widget.themeToggleButtonPosition === 'user-dropdown',
);

const showLanguageToggleInDropdown = computed(
  () =>
    preferences.widget.languageToggle &&
    preferences.widget.languageToggleButtonPosition === 'user-dropdown',
);

const showTimezoneInDropdown = computed(
  () =>
    preferences.widget.timezone &&
    preferences.widget.timezoneButtonPosition === 'user-dropdown',
);

const showFullscreenInDropdown = computed(
  () =>
    preferences.widget.fullscreen &&
    preferences.widget.fullscreenButtonPosition === 'user-dropdown',
);

const showNotificationInDropdown = computed(
  () =>
    preferences.widget.notification &&
    preferences.widget.notificationButtonPosition === 'user-dropdown',
);

const showRefreshInDropdown = computed(
  () =>
    preferences.widget.refresh &&
    preferences.widget.refreshButtonPosition === 'user-dropdown',
);

const hasAnyInDropdown = computed(
  () =>
    showLockInDropdown.value ||
    showLogoutInDropdown.value ||
    showGlobalSearchInDropdown.value ||
    showThemeToggleInDropdown.value ||
    showLanguageToggleInDropdown.value ||
    showTimezoneInDropdown.value ||
    showFullscreenInDropdown.value ||
    showNotificationInDropdown.value ||
    showRefreshInDropdown.value,
);

const altView = computed(() => (isWindowsOs() ? 'Alt' : '⌥'));

const enableLogoutShortcutKey = computed(() => {
  return showLogoutInDropdown.value && globalLogoutShortcutKey.value;
});

const enableLockScreenShortcutKey = computed(() => {
  return showLockInDropdown.value && globalLockScreenShortcutKey.value;
});

const enableShortcutKey = computed(() => {
  return (
    (showLockInDropdown.value || showLogoutInDropdown.value) &&
    preferences.shortcutKeys.enable
  );
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
  openPopover.value = false;
}

function handleSubmitLogout() {
  emit('logout');
  logoutModalApi.close();
}

// 设置 - 打开偏好设置抽屉
function handleOpenSettings() {
  refPreferences.value?.open();
}

// 刷新当前页面
function handleRefresh() {
  openPopover.value = false;
  refresh();
}

// 搜索 - 不关闭 dropdown，直接触发 GlobalSearch 组件的弹框
function handleGlobalSearch() {
  refGlobalSearch.value?.open();
}

// 语言切换 - 阻止 Radix 默认关闭外层 dropdown，就地展开/收起 locale 列表
const showLanguageList = ref(false);
function handleLanguageToggleSelect(event?: Event) {
  event?.preventDefault();
  showLanguageList.value = !showLanguageList.value;
}
async function handleLocaleChange(event: Event, value: 'en-US' | 'zh-CN') {
  // 阻止默认关闭，让用户能继续看到选择结果；选完手动收起
  event.preventDefault();
  updatePreferences({ app: { locale: value } });
  await loadLocaleMessages(value);
  showLanguageList.value = false;
  openPopover.value = false;
}

if (enableShortcutKey.value) {
  const keys = useMagicKeys();
  const logoutKey = keys['Alt+KeyQ'];
  const lockKey = keys['Alt+KeyL'];

  if (logoutKey) {
    whenever(logoutKey, () => {
      if (enableLogoutShortcutKey.value) {
        handleLogout();
      }
    });
  }

  if (lockKey) {
    whenever(lockKey, () => {
      if (enableLockScreenShortcutKey.value) {
        handleOpenLock();
      }
    });
  }
}
</script>

<template>
  <LockModal
    v-if="showLockInDropdown"
    :avatar="avatar"
    :text="text"
    @submit="handleSubmitLock"
  />

  <LogoutModal
    v-if="showLogoutInDropdown"
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

  <Preferences
    v-if="preferencesButtonPosition.userDropdown"
    ref="refPreferences"
    :show-button="false"
    @clear-preferences-and-logout="emit('clearPreferencesAndLogout')"
  />

  <GlobalSearch
    v-if="showGlobalSearchInDropdown"
    ref="refGlobalSearch"
    :enable-shortcut-key="globalSearchShortcutKey"
    :menus="accessStore.accessMenus"
    :show-button="false"
  />

  <DropdownMenu v-model:open="openPopover" :modal="false">
    <DropdownMenuTrigger ref="refTrigger" :disabled="props.trigger === 'hover'">
      <div class="mr-2 ml-1 cursor-pointer rounded-full p-1.5 hover:bg-accent">
        <div class="flex-center hover:text-accent-foreground">
          <VbenAvatar :alt="text" :src="avatar" class="size-8" dot />
        </div>
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="mr-2 min-w-60 p-0 pb-1">
      <div ref="refContent">
        <DropdownMenuLabel class="flex items-center p-3">
          <VbenAvatar
            :alt="text"
            :src="avatar"
            class="size-12"
            dot
            dot-class="bottom-0 right-1 border-2 size-4 bg-green-500"
          />
          <div class="ml-2 w-full">
            <div
              v-if="tagText || text || $slots.tagText"
              class="mb-1 flex items-center text-sm font-medium text-foreground"
            >
              {{ text }}
              <slot name="tagText">
                <Badge
                  v-if="tagText"
                  variant="secondary"
                  class="ml-2 text-green-400"
                >
                  {{ tagText }}
                </Badge>
              </slot>
            </div>
            <div class="text-xs font-normal text-muted-foreground">
              {{ description }}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator v-if="menus?.length" />
        <DropdownMenuItem
          v-for="menu in menus"
          :key="menu.text"
          class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
          @click="menu.handler"
        >
          <VbenIconButton class="mr-2" @click="menu.handler">
            <VbenIcon :icon="menu.icon" class="size-4" />
          </VbenIconButton>
          {{ menu.text }}
        </DropdownMenuItem>
        <template v-if="showLockInDropdown || showLogoutInDropdown">
          <DropdownMenuSeparator v-if="showLockInDropdown" />
          <DropdownMenuItem
            v-if="showLockInDropdown"
            class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
            @click="handleOpenLock"
          >
            <VbenIconButton class="mr-2" @click="handleOpenLock">
              <LockKeyhole class="size-4" />
            </VbenIconButton>
            {{ $t('ui.widgets.lockScreen.title') }}
            <DropdownMenuShortcut v-if="enableLockScreenShortcutKey">
              {{ altView }} L
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator v-if="showLogoutInDropdown" />
          <DropdownMenuItem
            v-if="showLogoutInDropdown"
            class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
            @click="handleLogout"
          >
            <VbenIconButton class="mr-2" @click="handleLogout">
              <LogOut class="size-4" />
            </VbenIconButton>
            {{ $t('common.logout') }}
            <DropdownMenuShortcut v-if="enableLogoutShortcutKey">
              {{ altView }} Q
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </template>
        <template
          v-if="
            showGlobalSearchInDropdown ||
            showThemeToggleInDropdown ||
            showLanguageToggleInDropdown ||
            showTimezoneInDropdown ||
            showFullscreenInDropdown ||
            showNotificationInDropdown ||
            showRefreshInDropdown
          "
        >
          <DropdownMenuSeparator />
          <DropdownMenuItem
            v-if="showGlobalSearchInDropdown"
            class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
            @select="handleGlobalSearch"
          >
            <VbenIconButton class="mr-2" @click="handleGlobalSearch">
              <Search class="size-4" />
            </VbenIconButton>
            {{ $t('preferences.widget.globalSearch') }}
          </DropdownMenuItem>
          <DropdownMenuItem
            v-if="showThemeToggleInDropdown"
            class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
          >
            <ThemeToggle class="mr-2" />
            {{ $t('preferences.theme.title') }}
          </DropdownMenuItem>
          <DropdownMenuItem
            v-if="showLanguageToggleInDropdown"
            class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
            @select="handleLanguageToggleSelect"
          >
            <VbenIconButton class="mr-2" @click="handleLanguageToggleSelect">
              <Languages class="size-4" />
            </VbenIconButton>
            {{ $t('preferences.widget.languageToggle') }}
          </DropdownMenuItem>
          <template v-if="showLanguageList">
            <DropdownMenuItem
              v-for="lang in SUPPORT_LANGUAGES"
              :key="lang.value"
              class="mx-1 flex cursor-pointer items-center rounded-sm py-1 pl-8 leading-8"
              @select="(e: Event) => handleLocaleChange(e, lang.value)"
            >
              <span
                :class="
                  lang.value === preferences.app.locale ? 'bg-foreground' : ''
                "
                class="mr-2 size-1.5 rounded-full"
              ></span>
              {{ lang.label }}
            </DropdownMenuItem>
          </template>
          <DropdownMenuItem
            v-if="showTimezoneInDropdown"
            class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
          >
            <TimezoneButton class="mr-2" />
            {{ $t('ui.widgets.timezone.setTimezone') }}
          </DropdownMenuItem>
          <DropdownMenuItem
            v-if="showFullscreenInDropdown"
            class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
          >
            <VbenFullScreen class="mr-2" />
            {{ $t('preferences.widget.fullscreen') }}
          </DropdownMenuItem>
          <DropdownMenuItem
            v-if="showNotificationInDropdown"
            class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
          >
            <Notification class="mr-2" />
            {{ $t('preferences.widget.notification') }}
          </DropdownMenuItem>
          <DropdownMenuItem
            v-if="showRefreshInDropdown"
            class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
            @click="handleRefresh"
          >
            <VbenIconButton class="mr-2" @click="handleRefresh">
              <RotateCw class="size-4" />
            </VbenIconButton>
            {{ $t('preferences.widget.refresh') }}
          </DropdownMenuItem>
        </template>
        <DropdownMenuSeparator
          v-if="hasAnyInDropdown || preferencesButtonPosition.userDropdown"
        />
        <DropdownMenuItem
          v-if="preferencesButtonPosition.userDropdown"
          class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
          @click="handleOpenSettings"
        >
          <VbenIconButton class="mr-2" @click="handleOpenSettings">
            <Settings class="size-4" />
          </VbenIconButton>
          {{ $t('preferences.title') }}
        </DropdownMenuItem>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
