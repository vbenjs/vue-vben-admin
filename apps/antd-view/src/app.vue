<script lang="ts" setup>
import 'dayjs/locale/zh-cn';

import { preferences, usePreferences } from '@vben-core/preferences';

import { GlobalProvider } from '@vben/common-ui';
import { ConfigProvider, theme } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import { computed } from 'vue';

defineOptions({ name: 'App' });

dayjs.locale(zhCN.locale);

const { isDark } = usePreferences();

const tokenTheme = computed(() => {
  const algorithms = isDark.value
    ? [theme.darkAlgorithm]
    : [theme.defaultAlgorithm];

  // antd 紧凑模式算法
  if (preferences.app.compact) {
    algorithms.push(theme.compactAlgorithm);
  }
  return {
    algorithms,
    token: { colorPrimary: preferences.theme.colorPrimary },
  };
});
</script>

<template>
  <GlobalProvider>
    <ConfigProvider :locale="zhCN" :theme="tokenTheme">
      <RouterView />
    </ConfigProvider>
  </GlobalProvider>
</template>
