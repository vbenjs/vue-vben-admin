<script lang="ts" setup>
import 'dayjs/locale/zh-cn';

import { GlobalProvider } from '@vben/common-ui';
import { preference, usePreference } from '@vben/preference';
import { ConfigProvider, theme } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import { computed } from 'vue';

defineOptions({ name: 'App' });

dayjs.locale(zhCN.locale);

const { isDark } = usePreference();

const tokenTheme = computed(() => {
  const { colorPrimary, compact } = preference;
  const algorithms = isDark.value
    ? [theme.darkAlgorithm]
    : [theme.defaultAlgorithm];

  // antd 紧凑模式算法
  if (compact) {
    algorithms.push(theme.compactAlgorithm);
  }
  return {
    algorithms,
    token: { colorPrimary },
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
