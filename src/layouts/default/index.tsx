import './index.less';

import { defineComponent, unref, computed, ref } from 'vue';
import { Layout, BackTop } from 'ant-design-vue';
import LayoutHeader from './header/LayoutHeader';

import LayoutContent from './content/index.vue';
import LayoutFooter from './footer';
import LayoutLockPage from '/@/views/sys/lock/index.vue';
import LayoutSideBar from './sider';
import SettingBtn from './setting/index.vue';
import LayoutMultipleHeader from './header/LayoutMultipleHeader';

import { MenuModeEnum } from '/@/enums/menuEnum';

import { useRouter } from 'vue-router';
import { useFullContent } from '/@/hooks/web/useFullContent';
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { createLayoutContext } from './useLayoutContext';

import { registerGlobComp } from '/@/components/registerGlobComp';
import { createBreakpointListen } from '/@/hooks/event/useBreakpoint';
import { isMobile } from '/@/utils/is';
export default defineComponent({
  name: 'DefaultLayout',
  setup() {
    const { currentRoute } = useRouter();
    const headerRef = ref<ComponentRef>(null);
    const isMobileRef = ref(false);

    createLayoutContext({ fullHeader: headerRef, isMobile: isMobileRef });

    createBreakpointListen(() => {
      isMobileRef.value = isMobile();
    });

    // ! Only register global components here
    // ! Can reduce the size of the first screen code
    // default layout It is loaded after login. So it won’t be packaged to the first screen
    registerGlobComp();

    const { getShowFullHeaderRef } = useHeaderSetting();

    const { getUseOpenBackTop, getShowSettingButton, getShowFooter } = useRootSetting();

    const { getShowMenu, getMenuMode, getSplit } = useMenuSetting();

    const { getFullContent } = useFullContent();

    const getShowLayoutFooter = computed(() => {
      return unref(getShowFooter) && !unref(currentRoute).meta?.hiddenFooter;
    });

    const showSideBarRef = computed(() => {
      return (
        unref(getSplit) ||
        (unref(getShowMenu) &&
          unref(getMenuMode) !== MenuModeEnum.HORIZONTAL &&
          !unref(getFullContent))
      );
    });

    function renderFeatures() {
      return (
        <>
          <LayoutLockPage />
          {/* back top */}
          {unref(getUseOpenBackTop) && <BackTop target={() => document.body} />}
          {/* open setting drawer */}
          {unref(getShowSettingButton) && <SettingBtn />}
        </>
      );
    }

    return () => {
      return (
        <Layout class="default-layout">
          {() => (
            <>
              {renderFeatures()}

              {unref(getShowFullHeaderRef) && <LayoutHeader fixed={true} ref={headerRef} />}

              <Layout>
                {() => (
                  <>
                    {unref(showSideBarRef) && <LayoutSideBar />}
                    <Layout class="default-layout__main">
                      {() => (
                        <>
                          <LayoutMultipleHeader />
                          <LayoutContent />
                          {unref(getShowLayoutFooter) && <LayoutFooter />}
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
