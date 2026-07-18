<script setup lang="ts">
import type { SelectOption } from '@vben/types';

import { computed } from 'vue';

import { $t } from '@vben/locales';

import SelectItem from '../select-item.vue';

defineOptions({
  name: 'PreferenceInterfaceControl',
});

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
const appPreferencesButtonPosition = defineModel<string>(
  'appPreferencesButtonPosition',
);
const widgetRefreshButtonPosition = defineModel<string>(
  'widgetRefreshButtonPosition',
);
const widgetTimezoneButtonPosition = defineModel<string>(
  'widgetTimezoneButtonPosition',
);

const positionItems = computed((): SelectOption[] => [
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
]);

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
</script>

<template>
  <SelectItem
    v-model="widgetGlobalSearchButtonPosition"
    :items="buttonPositionItems"
  >
    {{ $t('preferences.widget.globalSearchPosition') }}
  </SelectItem>
  <SelectItem
    v-model="widgetThemeToggleButtonPosition"
    :items="buttonPositionItems"
  >
    {{ $t('preferences.widget.themeTogglePosition') }}
  </SelectItem>
  <SelectItem
    v-model="widgetLanguageToggleButtonPosition"
    :items="buttonPositionItems"
  >
    {{ $t('preferences.widget.languageTogglePosition') }}
  </SelectItem>
  <SelectItem
    v-model="widgetFullscreenButtonPosition"
    :items="buttonPositionItems"
  >
    {{ $t('preferences.widget.fullscreenPosition') }}
  </SelectItem>
  <SelectItem
    v-model="widgetNotificationButtonPosition"
    :items="buttonPositionItems"
  >
    {{ $t('preferences.widget.notificationPosition') }}
  </SelectItem>
  <SelectItem
    v-model="widgetLockScreenButtonPosition"
    :items="buttonPositionItems"
  >
    {{ $t('preferences.widget.lockScreenPosition') }}
  </SelectItem>
  <SelectItem v-model="widgetLogoutButtonPosition" :items="buttonPositionItems">
    {{ $t('preferences.widget.logoutButtonPosition') }}
  </SelectItem>
  <SelectItem
    v-model="widgetRefreshButtonPosition"
    :items="buttonPositionItems"
  >
    {{ $t('preferences.widget.refreshPosition') }}
  </SelectItem>
  <SelectItem
    v-model="widgetTimezoneButtonPosition"
    :items="buttonPositionItems"
  >
    {{ $t('preferences.widget.timezonePosition') }}
  </SelectItem>
  <SelectItem v-model="appPreferencesButtonPosition" :items="positionItems">
    {{ $t('preferences.position.title') }}
  </SelectItem>
</template>
