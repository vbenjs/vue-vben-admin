<script setup lang="ts">
import { $t } from '@vben-core/locales';

import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceInterfaceControl',
});

const widgetGlobalSearch = defineModel<boolean>('widgetGlobalSearch');
const widgetFullscreen = defineModel<boolean>('widgetFullscreen');
const widgetLanguageToggle = defineModel<boolean>('widgetLanguageToggle');
const widgetNotification = defineModel<boolean>('widgetNotification');
const widgetThemeToggle = defineModel<boolean>('widgetThemeToggle');
const widgetAiAssistant = defineModel<boolean>('widgetAiAssistant');
const widgetSidebarToggle = defineModel<boolean>('widgetSidebarToggle');
</script>

<template>
  <SwitchItem v-model="widgetGlobalSearch">
    {{ $t('preferences.widget.global-search') }}
  </SwitchItem>
  <SwitchItem v-model="widgetThemeToggle">
    {{ $t('preferences.widget.theme-toggle') }}
  </SwitchItem>
  <SwitchItem v-model="widgetLanguageToggle">
    {{ $t('preferences.widget.language-toggle') }}
  </SwitchItem>
  <SwitchItem v-model="widgetFullscreen">
    {{ $t('preferences.widget.fullscreen') }}
  </SwitchItem>
  <SwitchItem v-model="widgetNotification">
    {{ $t('preferences.widget.notification') }}
  </SwitchItem>
  <SwitchItem v-model="widgetAiAssistant">
    {{ $t('preferences.widget.ai-assistant') }}
  </SwitchItem>
  <SwitchItem v-model="widgetSidebarToggle">
    {{ $t('preferences.widget.sidebar-toggle') }}
  </SwitchItem>
</template>
