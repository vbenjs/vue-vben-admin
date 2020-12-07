<template>
  <ConfigProvider
    v-bind="lockEvent"
    :locale="antConfigLocale"
    :transform-cell-text="transformCellText"
  >
    <AppProvider>
      <router-view />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ConfigProvider } from 'ant-design-vue';

  import { getConfigProvider, initAppConfigStore } from '/@/setup/App';

  import { useLockPage } from '/@/hooks/web/useLockPage';
  import { useLocale } from '/@/hooks/web/useLocale';

  import { AppProvider } from '/@/components/Application';

  export default defineComponent({
    name: 'App',
    components: { ConfigProvider, AppProvider },
    setup() {
      // Initialize vuex internal system configuration
      initAppConfigStore();

      // Get ConfigProvider configuration
      const { transformCellText } = getConfigProvider();

      // Create a lock screen monitor
      const lockEvent = useLockPage();

      // support Multi-language
      const { antConfigLocale } = useLocale();

      return {
        transformCellText,
        antConfigLocale,
        lockEvent,
      };
    },
  });
</script>
