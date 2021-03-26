<template>
  <ConfigProvider v-bind="lockEvent" :locale="getAntdLocale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';

  import { initAppConfigStore } from '/@/logics/initAppConfig';

  import { useLockPage } from '/@/hooks/web/useLockPage';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';

  export default defineComponent({
    name: 'App',
    components: { ConfigProvider, AppProvider },
    setup() {
      // Initialize vuex internal system configuration
      initAppConfigStore();

      useTitle();

      // support Multi-language
      const { getAntdLocale } = useLocale();

      // Create a lock screen monitor
      const lockEvent = useLockPage();

      return { getAntdLocale, lockEvent };
    },
  });
</script>
