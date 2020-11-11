import { defineComponent, unref, computed } from 'vue';
import { Layout, BackTop } from 'ant-design-vue';
import LayoutHeader from './header/LayoutHeader';

import { appStore } from '/@/store/modules/app';
import LayoutContent from './LayoutContent';
import LayoutSideBar from './LayoutSideBar';
import SettingBtn from './setting/index.vue';
import MultipleTabs from './multitabs/index';

import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';
import { useFullContent } from '/@/hooks/web/useFullContent';

import LockPage from '/@/views/sys/lock/index.vue';
import { registerGlobComp } from '/@/components/registerGlobComp';

import './index.less';
export default defineComponent({
  name: 'DefaultLayout',
  setup() {
    // ! Only register global components here
    // ! Can reduce the size of the first screen code
    // default layout It is loaded after login. So it won’t be packaged to the first screen
    registerGlobComp();

    const { getFullContent } = useFullContent();

    const getProjectConfigRef = computed(() => appStore.getProjectConfig);

    const getLockMainScrollStateRef = computed(() => appStore.getLockMainScrollState);

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

    const getIsLockRef = computed(() => {
      const { getLockInfo } = appStore;
      const { isLock } = getLockInfo;
      return isLock;
    });

    const showSideBarRef = computed(() => {
      const {
        menuSetting: { show, mode, split },
      } = unref(getProjectConfigRef);
      return split || (show && mode !== MenuModeEnum.HORIZONTAL && !unref(getFullContent));
    });

    const showFullHeaderRef = computed(() => {
      return !unref(getFullContent) && unref(isShowMixHeaderRef) && unref(showHeaderRef);
    });

    const showInsetHeaderRef = computed(() => {
      return !unref(getFullContent) && !unref(isShowMixHeaderRef) && unref(showHeaderRef);
    });

    const fixedHeaderClsRef = computed(() => {
      const {
        headerSetting: { fixed },
      } = unref(getProjectConfigRef);
      const fixedHeaderCls = fixed
        ? 'fixed' + (unref(getLockMainScrollStateRef) ? ' lock' : '')
        : '';
      return fixedHeaderCls;
    });

    const showTabsRef = computed(() => {
      const {
        multiTabsSetting: { show },
      } = unref(getProjectConfigRef);
      return show && !unref(getFullContent);
    });

    const showClassSideBarRef = computed(() => {
      const {
        menuSetting: { split, hidden },
      } = unref(getProjectConfigRef);
      return split ? hidden : true;
    });

    function getTarget(): any {
      const {
        headerSetting: { fixed },
      } = unref(getProjectConfigRef);
      return document.querySelector(`.default-layout__${fixed ? 'main' : 'content'}`);
    }

    return () => {
      const { useOpenBackTop, showSettingButton } = unref(getProjectConfigRef);
      return (
        <Layout class="default-layout relative">
          {() => (
            <>
              {/* lock page */}
              {unref(getIsLockRef) && <LockPage />}
              {/* back top */}
              {useOpenBackTop && <BackTop target={getTarget} />}
              {/* open setting drawer */}
              {showSettingButton && <SettingBtn />}

              {unref(showFullHeaderRef) && <LayoutHeader />}

              <Layout>
                {() => (
                  <>
                    {unref(showSideBarRef) && (
                      <LayoutSideBar class={unref(showClassSideBarRef) ? '' : 'hidden'} />
                    )}
                    <Layout class={[`default-layout__content`, unref(fixedHeaderClsRef)]}>
                      {() => (
                        <>
                          {unref(showInsetHeaderRef) && <LayoutHeader />}

                          {unref(showTabsRef) && <MultipleTabs />}

                          <LayoutContent class={unref(fixedHeaderClsRef)} />
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
