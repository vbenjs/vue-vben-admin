<template>
  <ConfigProvider v-bind="lockEvent" :locale="antConfigLocale">
    <AppProvider>
      <router-view />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ConfigProvider } from 'ant-design-vue';

  import { initAppConfigStore } from '/@/setup/App';

  import { useLockPage } from '/@/hooks/web/useLockPage';
  import { useLocale } from '/@/hooks/web/useLocale';

  import { AppProvider } from '/@/components/Application';

  export default defineComponent({
    name: 'App',
    components: { ConfigProvider, AppProvider },
    setup() {
      // Initialize vuex internal system configuration
      initAppConfigStore();

      // Create a lock screen monitor
      const lockEvent = useLockPage();

      // support Multi-language
      const { antConfigLocale } = useLocale();

      return {
        antConfigLocale,
        lockEvent,
      };
    },
  });
</script>
