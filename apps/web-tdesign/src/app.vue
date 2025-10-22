<script lang="ts" setup>
import { onMounted } from "vue";

import { usePreferences } from "@vben/preferences";
import { merge } from "@vben/utils";

import { ConfigProvider } from "tdesign-vue-next";
import zhConfig from "tdesign-vue-next/es/locale/zh_CN";

defineOptions({ name: 'App' });
const { isDark } = usePreferences();

onMounted(() => {
  document.documentElement.setAttribute(
    'theme-mode',
    isDark.value ? 'dark' : '',
  );
});

const globalConfig = merge(zhConfig, {
  // 可以在此处定义更多自定义配置，具体可配置内容参看 API 文档
  calendar: {},
  table: {},
  pagination: {},
});
</script>

<template>
  <ConfigProvider :global-config="globalConfig">
      <RouterView />
  </ConfigProvider>
</template>
