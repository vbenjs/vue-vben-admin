<template>
  <ConfigProvider v-bind="lockEvent" :locale="antConfigLocale">
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
  import { useLocale } from '/@/locales/useLocale';

  export default defineComponent({
    name: 'App',
    components: { ConfigProvider, AppProvider },
    setup() {
      // support Multi-language
      const { antConfigLocale, setLocale } = useLocale();

      setLocale();

      // Initialize vuex internal system configuration
      initAppConfigStore();

      // Create a lock screen monitor
      const lockEvent = useLockPage();

      return {
        antConfigLocale,
        lockEvent,
      };
    },
  });
</script>
