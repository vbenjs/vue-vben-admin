import { defineComponent, unref, onMounted, computed } from 'vue';
import { Layout, BackTop } from 'ant-design-vue';
import LayoutHeader from './LayoutHeader';

import { appStore } from '/@/store/modules/app';
import LayoutContent from './LayoutContent';
import LayoutSideBar from './LayoutSideBar';
import SettingBtn from './setting/index.vue';
import MultipleTabs from './multitabs/index';
import { FullLoading } from '/@/components/Loading/index';

import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';
import { useFullContent } from '/@/hooks/web/useFullContent';

import LockPage from '/@/views/sys/lock/index.vue';

import './index.less';
// import { userStore } from '/@/store/modules/user';
export default defineComponent({
  name: 'DefaultLayout',
  setup() {
    // 获取项目配置
    const { getFullContent } = useFullContent();

    const getProjectConfigRef = computed(() => {
      return appStore.getProjectConfig;
    });
    const getLockMainScrollStateRef = computed(() => {
      return appStore.getLockMainScrollState;
    });

    const showHeaderRef = computed(() => {
      const {
        headerSetting: { show },
      } = unref(getProjectConfigRef);
      return show;
    });
    const isShowMixHeaderRef = computed(() => {
      const {
        menuSetting: { type },
      } = unref(getProjectConfigRef);
      return type !== MenuTypeEnum.SIDEBAR && unref(showHeaderRef);
    });

    const showSideBarRef = computed(() => {
      const {
        menuSetting: { show, mode },
      } = unref(getProjectConfigRef);
      return show && mode !== MenuModeEnum.HORIZONTAL && !unref(getFullContent);
    });

    // const { currentRoute } = useRouter();
    onMounted(() => {
      // Each refresh will request the latest user information, if you don’t need it, you can delete it
      // userStore.getUserInfoAction({ userId: userStore.getUserInfoState.userId });
    });

    // Get project configuration
    // const { getFullContent } = useFullContent(currentRoute);
    function getTarget(): any {
      const {
        headerSetting: { fixed },
      } = unref(getProjectConfigRef);
      return document.querySelector(`.default-layout__${fixed ? 'main' : 'content'}`);
    }
    return () => {
      const { getPageLoading, getLockInfo } = appStore;
      const {
        openPageLoading,
        useOpenBackTop,
        showSettingButton,
        multiTabsSetting: { show: showTabs },
        headerSetting: { fixed },
      } = unref(getProjectConfigRef);
      // const fixedHeaderCls = fixed ? ('fixed' + getLockMainScrollState ? ' lock' : '') : '';
      const fixedHeaderCls = fixed
        ? 'fixed' + (unref(getLockMainScrollStateRef) ? ' lock' : '')
        : '';
      const { isLock } = getLockInfo;
      return (
        <Layout class="default-layout relative">
          {() => (
            <>
              {isLock && <LockPage />}
              {!unref(getFullContent) && unref(isShowMixHeaderRef) && unref(showHeaderRef) && (
                <LayoutHeader />
              )}
              {showSettingButton && <SettingBtn />}
              <Layout>
                {() => (
                  <>
                    {unref(showSideBarRef) && <LayoutSideBar />}
                    <Layout class={[`default-layout__content`, fixedHeaderCls]}>
                      {() => (
                        <>
                          {!unref(getFullContent) &&
                            !unref(isShowMixHeaderRef) &&
                            unref(showHeaderRef) && <LayoutHeader />}

                          {showTabs && !unref(getFullContent) && (
                            <Layout.Header class={`default-layout__tabs`}>
                              {() => <MultipleTabs />}
                            </Layout.Header>
                          )}
                          {useOpenBackTop && <BackTop target={getTarget} />}
                          <div class={[`default-layout__main`, fixedHeaderCls]}>
                            {openPageLoading && (
                              <FullLoading
                                class={[`default-layout__loading`, !getPageLoading && 'hidden']}
                              />
                            )}
                            <LayoutContent />
                          </div>
                        </>
                      )}
                    </Layout>
                  </>
                )}
              </Layout>
            </>
          )}
        </Layout>
      );
    };
  },
});
