<template>
  <ConfigProvider :locale="zhCN" :transformCellText="transformCellText" v-bind="lockOn">
    <router-view />
  </ConfigProvider>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ConfigProvider } from 'ant-design-vue';
  import { createBreakpointListen } from '/@/hooks/event/useBreakpoint';

  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import moment from 'moment';
  import 'moment/locale/zh-cn';
  import axios from 'axios';

  import { useConfigProvider, useInitAppConfigStore, useListenerNetWork } from './useApp';
  import { useLockPage } from '/@/hooks/web/useLockPage';
  moment.locale('zh-cn');
  export default defineComponent({
    name: 'App',
    components: { ConfigProvider },
    setup() {
      useInitAppConfigStore();
      useListenerNetWork();
      createBreakpointListen();
      const { transformCellText } = useConfigProvider();
      const { on: lockOn } = useLockPage();
      axios.get('/api/users?page=2');
      return {
        transformCellText,
        zhCN,
        lockOn,
      };
    },
  });
</script>
