<script lang="ts" setup>
import type { GlobalConfigProvider } from 'tdesign-vue-next';

import { watch } from 'vue';

import { useTDesignDesignTokens } from '@vben/hooks';
import { usePreferences } from '@vben/preferences';

import { merge } from 'es-toolkit/compat';
import { ConfigProvider } from 'tdesign-vue-next';
import zhConfig from 'tdesign-vue-next/es/locale/zh_CN';

defineOptions({ name: 'App' });
const { isDark } = usePreferences();

// 将 Vben 设计系统的 CSS 变量适配到 TDesign 的设计变量上
useTDesignDesignTokens();

watch(
  () => isDark.value,
  (dark) => {
    document.documentElement.setAttribute(
      'theme-mode',
      dark ? 'dark' : 'light',
    );
  },
  { immediate: true },
);

const customConfig: GlobalConfigProvider = {
  // 可以在此处定义更多自定义配置，具体可配置内容参看 API 文档
  calendar: {},
  table: {},
  pagination: {},
};
const globalConfig = merge(zhConfig, customConfig);
</script>

<template>
  <ConfigProvider :global-config="globalConfig">
    <RouterView />
  </ConfigProvider>
</template>
