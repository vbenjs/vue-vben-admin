<template>
  <ConfigProvider :locale="getAntdLocale" :theme="themeConfig">
    <App class="h-full w-full">
      <AppProvider>
        <RouterView />
      </AppProvider>
    </App>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { AppProvider } from '@/components/Application';
  import { useTitle } from '@/hooks/web/useTitle';
  import { useLocale } from '@/locales/useLocale';
  import { App, ConfigProvider } from 'ant-design-vue';
  import { storeToRefs } from 'pinia';
  import { useAppStore } from '@/store/modules/app';
  import 'dayjs/locale/zh-cn';

  // support Multi-language
  const { getAntdLocale } = useLocale();

  const appStore = useAppStore();
  const { themeConfig } = storeToRefs(appStore);
  // Listening to page changes and dynamically changing site titles
  useTitle();
</script>
