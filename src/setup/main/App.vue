<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

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
  import { useLockPage } from '@/hooks/functions/useLockPage';
  import { createBreakpointListen } from '@/hooks/event/useBreakpoint';
  import { useTimeout } from '@/hooks/core/useTimeout';

  import { pageEnum } from '@/enums/pageEnum';
  import { ExceptionEnum } from '@/enums/exceptionEnum';
  moment.locale('zh-cn');

  export default defineComponent({
    name: 'App',
    setup(_, { root }) {
      // 检测网络状态
      useNetWork({
        onLineFn: () => {
          root.$router.replace(pageEnum.BASE_HOME);
          useTimeout(() => {
            appStore.commitPageLoadingState(false);
          }, 300);
        },
        offLineFn: () => {
          root.$router.replace({
            path: pageEnum.ERROR_PAGE,
            query: {
              status: String(ExceptionEnum.NET_WORK_ERROR),
            },
          });
        },
      });
      // 初始化配置
      useInitProjCfg();
      // 监听响应式断点
      createBreakpointListen();

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
