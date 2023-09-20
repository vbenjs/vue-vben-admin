<template>
  <ConfigProvider :locale="getAntdLocale" :theme="isDark ? darkTheme : {}">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider, theme } from 'ant-design-vue';
  import { AppProvider } from '@/components/Application';
  import { useTitle } from '@/hooks/web/useTitle';
  import { useLocale } from '@/locales/useLocale';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import 'dayjs/locale/zh-cn';
  import { computed } from 'vue';
  import { ThemeEnum } from '/@/enums/appEnum';

  const { darkAlgorithm } = theme;
  // support Multi-language
  const { getAntdLocale } = useLocale();
  const { getDarkMode } = useRootSetting();

  const isDark = computed(() => getDarkMode.value === ThemeEnum.DARK);

  const darkTheme = {
    algorithm: [darkAlgorithm],
  };
  // Listening to page changes and dynamically changing site titles
  useTitle();
</script>
