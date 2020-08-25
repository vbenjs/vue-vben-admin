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
  import { setupInitRumTimeVm } from '@/hooks/core/useRouter';
  import { useInitProjCfg } from './useInitApp';
  import { appStore } from '@/store/modules/app';

  import { useLockPage } from '@/hooks/functions/useLockPage';
  import { createBreakpointListen } from '@/hooks/event/useBreakpoint';
  import { useTimeout } from '@/hooks/core/useTimeout';

  import { pageEnum } from '@/enums/pageEnum';
  import { ExceptionEnum } from '@/enums/exceptionEnum';

  const LockPage = (() => import('@/views/sys/lock/index.vue')) as any;

  moment.locale('zh-cn');

  export default defineComponent({
    name: 'App',
    setup(_, { root }) {
      setupInitRumTimeVm();

      const {
        headerSetting: { useLockPage: canLockPage } = {},
        listenNetWork,
      } = appStore.getProjCfg;
      // 检测网络状态
      listenNetWork &&
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

      let lockOn: { [key: string]: Fn } = {};
      if (canLockPage) {
        const { on } = useLockPage();
        lockOn = on;
      }

      function renderEmpty() {
        return <BasicEmpty />;
      }
      return () => {
        const { getLockInfo } = appStore;
        const { isLock } = getLockInfo || {};

        function transformCellText({ text }: { text: string }) {
          if (!text) {
            return ' - ';
          }
          return text;
        }

        return (
          <div id="app" on={lockOn}>
            {isLock && <LockPage />}
            <ConfigProvider
              locale={zhCN}
              renderEmpty={renderEmpty}
              transformCellText={transformCellText}
            >
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
