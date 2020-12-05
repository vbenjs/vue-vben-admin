<template>
  <ConfigProvider
    v-bind="lockEvent"
    :locale="antConfigLocale"
    :transform-cell-text="transformCellText"
  >
    <router-view />
  </ConfigProvider>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ConfigProvider } from 'ant-design-vue';

  import { getConfigProvider, initAppConfigStore } from '/@/setup/App';

  import { useLockPage } from '/@/hooks/web/useLockPage';
  import { useLocale } from '/@/hooks/web/useLocale';

  export default defineComponent({
    name: 'App',
    components: { ConfigProvider },
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
