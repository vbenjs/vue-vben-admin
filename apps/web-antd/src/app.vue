<script lang="ts" setup>
import { computed } from 'vue';

import { GlobalProvider } from '@vben/common-ui';
import { preferences, usePreferences } from '@vben-core/preferences';

import { App, ConfigProvider, theme } from 'ant-design-vue';

import { antdLocale } from '#/locales';

defineOptions({ name: 'App' });

const { isDark } = usePreferences();

const tokenTheme = computed(() => {
  const algorithm = isDark.value
    ? [theme.darkAlgorithm]
    : [theme.defaultAlgorithm];

  // antd 紧凑模式算法
  if (preferences.app.compact) {
    algorithm.push(theme.compactAlgorithm);
  }

  return {
    algorithm,
    token: { colorPrimary: preferences.theme.colorPrimary },
  };
});
</script>

<template>
  <GlobalProvider>
    <ConfigProvider :locale="antdLocale" :theme="tokenTheme">
      <App>
        <RouterView />
      </App>
    </ConfigProvider>
  </GlobalProvider>
</template>
