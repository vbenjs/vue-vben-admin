import { defineComponent, unref, computed } from 'vue';
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
import { registerGlobComp } from '/@/components/registerGlobComp';

import './index.less';
export default defineComponent({
  name: 'DefaultLayout',
  setup() {
    // ! 在这里才注册全局组件
    // ! 可以减少首屏代码体积
    // default layout是在登录后才加载的。所以不会打包到首屏去
    registerGlobComp();

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
        menuSetting: { show, mode, split },
      } = unref(getProjectConfigRef);
      return split || (show && mode !== MenuModeEnum.HORIZONTAL && !unref(getFullContent));
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
        menuSetting: { split, hidden },
      } = unref(getProjectConfigRef);

      const fixedHeaderCls = fixed
        ? 'fixed' + (unref(getLockMainScrollStateRef) ? ' lock' : '')
        : '';

      const { isLock } = getLockInfo;

      const showSideBar = split ? hidden : true;
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
                    {unref(showSideBarRef) && <LayoutSideBar class={showSideBar ? '' : 'hidden'} />}
                    <Layout class={[`default-layout__content`, fixedHeaderCls]}>
                      {() => (
                        <>
                          {!unref(getFullContent) &&
                            !unref(isShowMixHeaderRef) &&
                            unref(showHeaderRef) && <LayoutHeader />}

                          {showTabs && !unref(getFullContent) && (
                            <MultipleTabs class={`default-layout__tabs`} />
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
