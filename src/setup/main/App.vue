<script lang="tsx">
  import { defineComponent } from '@/setup/vue';

  // comp
  import { BasicEmpty } from '@/components/empty/index';
  import { ConfigProvider } from 'ant-design-vue';

  // // local
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import moment from 'moment';
  import 'moment/locale/zh-cn';

  // hook
  import { useNetWork } from '@/hooks/event/useNetWork';
  import { useInitProjCfg } from './useInitApp';
  import { appStore } from '@/store/modules/app';

  import LockPage from '@/views/sys/lock/index.vue';
  import { useLockPage } from '@/hooks/modules/useLockPage';
  moment.locale('zh-cn');

  export default defineComponent({
    setup(_, { root }) {
      // 检测网络状态
      useNetWork(root.$router);
      useInitProjCfg();

      function renderEmpty() {
        return <BasicEmpty />;
      }
      const { registerGlobOnKeyup, registerGlobOnMouseMove } = useLockPage();
      return () => {
        const { getLockInfo } = appStore;
        const { isLock } = getLockInfo || {};
        return (
          <div id="app" onKeyup={registerGlobOnKeyup} onMousemove={registerGlobOnMouseMove}>
            {isLock && <LockPage />}
            <ConfigProvider ider locale={zhCN} renderEmpty={renderEmpty}>
              <router-view />
            </ConfigProvider>
          </div>
        );
      };
    },
  });
</script>
<style lang="less">
  @import '~@design';
  @import '~@/design/normalize.less';
</style>
