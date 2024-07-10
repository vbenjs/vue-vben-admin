<script setup lang="ts">
import { computed } from 'vue';

import { $t } from '@vben-core/locales';
import { isWindowsOs } from '@vben-core/toolkit';

import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceGeneralConfig',
});

const shortcutKeysEnable = defineModel<boolean>('shortcutKeysEnable');
const shortcutKeysGlobalSearch = defineModel<boolean>(
  'shortcutKeysGlobalSearch',
);
const shortcutKeysLogout = defineModel<boolean>('shortcutKeysLogout');
const shortcutKeysPreferences = defineModel<boolean>('shortcutKeysPreferences');

const altView = computed(() => (isWindowsOs() ? 'Alt' : '⌥'));
</script>

<template>
  <SwitchItem v-model="shortcutKeysEnable">
    {{ $t('preferences.shortcutKeys.title') }}
  </SwitchItem>
  <SwitchItem v-if="shortcutKeysEnable" v-model="shortcutKeysGlobalSearch">
    {{ $t('preferences.shortcutKeys.search') }}
    <template #shortcut>
      {{ isWindowsOs() ? 'Ctrl' : '⌘' }}
      <kbd> K </kbd>
    </template>
  </SwitchItem>
  <SwitchItem v-if="shortcutKeysEnable" v-model="shortcutKeysLogout">
    {{ $t('preferences.shortcutKeys.logout') }}
    <template #shortcut> {{ altView }} Q </template>
  </SwitchItem>
  <SwitchItem v-if="shortcutKeysEnable" v-model="shortcutKeysPreferences">
    {{ $t('preferences.shortcutKeys.preferences') }}
    <template #shortcut> {{ altView }} , </template>
  </SwitchItem>
</template>
