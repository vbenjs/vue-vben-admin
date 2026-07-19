<script setup lang="ts">
import type { PreferencesButtonPositionType, SelectOption } from '@vben/types';

import { computed } from 'vue';

import { $t } from '@vben/locales';

import DraggableList from '../draggable-list.vue';

defineOptions({
  name: 'PreferenceInterfaceControl',
});

const widgetOrder = defineModel<string[]>('widgetOrder', { required: true });

const widgetGlobalSearchButtonPosition = defineModel<string>(
  'widgetGlobalSearchButtonPosition',
);
const widgetFullscreenButtonPosition = defineModel<string>(
  'widgetFullscreenButtonPosition',
);
const widgetLanguageToggleButtonPosition = defineModel<string>(
  'widgetLanguageToggleButtonPosition',
);
const widgetNotificationButtonPosition = defineModel<string>(
  'widgetNotificationButtonPosition',
);
const widgetThemeToggleButtonPosition = defineModel<string>(
  'widgetThemeToggleButtonPosition',
);
const widgetLockScreenButtonPosition = defineModel<string>(
  'widgetLockScreenButtonPosition',
);
const widgetLogoutButtonPosition = defineModel<string>(
  'widgetLogoutButtonPosition',
);
const widgetRefreshButtonPosition = defineModel<string>(
  'widgetRefreshButtonPosition',
);
const widgetTimezoneButtonPosition = defineModel<string>(
  'widgetTimezoneButtonPosition',
);
const appPreferencesButtonPosition = defineModel<PreferencesButtonPositionType>(
  'appPreferencesButtonPosition',
);

const buttonPositionItems = computed((): SelectOption[] => [
  {
    label: $t('preferences.widget.header'),
    value: 'header',
  },
  {
    label: $t('preferences.widget.userDropdown'),
    value: 'user-dropdown',
  },
  {
    label: $t('common.notShow'),
    value: 'none',
  },
]);

/**
 * preferences 按钮独享的位置选项：
 * 保留 auto/fixed 让 use-preferences.ts 的智能 fallback 生效
 * （移动端/全屏内容模式下自动切换 header/fixed，避免偏好入口死锁）
 */
const preferencesPositionItems = computed((): SelectOption[] => [
  {
    label: $t('preferences.position.auto'),
    value: 'auto',
  },
  {
    label: $t('preferences.position.header'),
    value: 'header',
  },
  {
    label: $t('preferences.position.fixed'),
    value: 'fixed',
  },
  {
    label: $t('preferences.position.userDropdown'),
    value: 'user-dropdown',
  },
  {
    label: $t('common.notShow'),
    value: 'none',
  },
]);

const positionMap: Record<string, string> = {
  globalSearch: 'widgetGlobalSearchButtonPosition',
  preferences: 'appPreferencesButtonPosition',
  themeToggle: 'widgetThemeToggleButtonPosition',
  languageToggle: 'widgetLanguageToggleButtonPosition',
  timezone: 'widgetTimezoneButtonPosition',
  fullscreen: 'widgetFullscreenButtonPosition',
  notification: 'widgetNotificationButtonPosition',
  lockScreenBtn: 'widgetLockScreenButtonPosition',
  logoutBtn: 'widgetLogoutButtonPosition',
  refresh: 'widgetRefreshButtonPosition',
};

const labelMap: Record<string, string> = {
  globalSearch: 'preferences.widget.globalSearch',
  preferences: 'preferences.title',
  themeToggle: 'preferences.widget.themeToggle',
  languageToggle: 'preferences.widget.languageToggle',
  timezone: 'preferences.widget.timezone',
  fullscreen: 'preferences.widget.fullscreen',
  notification: 'preferences.widget.notification',
  lockScreenBtn: 'ui.widgets.lockScreen.title',
  logoutBtn: 'common.logout',
  refresh: 'preferences.widget.refresh',
};

const draggableItems = computed(() =>
  (widgetOrder.value ?? []).map((key) => ({
    key,
    label: $t(labelMap[key] ?? key),
    position: getPosition(key),
    positionItems:
      key === 'preferences' ? preferencesPositionItems.value : undefined,
  })),
);

function getPosition(
  key: string,
): 'auto' | 'fixed' | 'header' | 'none' | 'user-dropdown' {
  const modelName = positionMap[key];
  if (!modelName) return 'none';
  const modelMap: Record<string, any> = {
    widgetGlobalSearchButtonPosition,
    widgetFullscreenButtonPosition,
    widgetLanguageToggleButtonPosition,
    widgetNotificationButtonPosition,
    widgetThemeToggleButtonPosition,
    widgetLockScreenButtonPosition,
    widgetLogoutButtonPosition,
    widgetRefreshButtonPosition,
    widgetTimezoneButtonPosition,
    appPreferencesButtonPosition,
  };
  return modelMap[modelName]?.value ?? 'none';
}

function handleUpdateOrder(keys: string[]) {
  widgetOrder.value = keys;
}

function handleUpdatePosition(
  key: string,
  position: 'auto' | 'fixed' | 'header' | 'none' | 'user-dropdown',
) {
  const modelName = positionMap[key];
  if (!modelName) return;
  const modelMap: Record<string, any> = {
    widgetGlobalSearchButtonPosition,
    widgetFullscreenButtonPosition,
    widgetLanguageToggleButtonPosition,
    widgetNotificationButtonPosition,
    widgetThemeToggleButtonPosition,
    widgetLockScreenButtonPosition,
    widgetLogoutButtonPosition,
    widgetRefreshButtonPosition,
    widgetTimezoneButtonPosition,
    appPreferencesButtonPosition,
  };
  modelMap[modelName].value = position;
}
</script>

<template>
  <DraggableList
    :items="draggableItems"
    :position-items="buttonPositionItems"
    @update-order="handleUpdateOrder"
    @update-position="handleUpdatePosition"
  />
</template>
