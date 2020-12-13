import './index.less';

import { defineComponent, unref, ref } from 'vue';
import { Layout } from 'ant-design-vue';
import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

import LayoutHeader from './header/LayoutHeader';
import LayoutContent from './content/index.vue';
import LayoutSideBar from './sider';
import LayoutMultipleHeader from './header/LayoutMultipleHeader';

import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { createLayoutContext } from './useLayoutContext';

import { registerGlobComp } from '/@/components/registerGlobComp';
import { createBreakpointListen } from '/@/hooks/event/useBreakpoint';
import { isMobile } from '/@/utils/is';

const LayoutFeatures = createAsyncComponent(() => import('/@/layouts/default/feature/index.vue'));
const LayoutFooter = createAsyncComponent(() => import('/@/layouts/default/footer/index.vue'));

export default defineComponent({
  name: 'DefaultLayout',
  setup() {
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

    const { getShowSidebar } = useMenuSetting();

    return () => {
      return (
        <Layout class="default-layout">
          {() => (
            <>
              <LayoutFeatures />

              {unref(getShowFullHeaderRef) && <LayoutHeader fixed={true} ref={headerRef} />}

              <Layout>
                {() => (
                  <>
                    {unref(getShowSidebar) && <LayoutSideBar />}
                    <Layout class="default-layout__main">
                      {() => (
                        <>
                          <LayoutMultipleHeader />
                          <LayoutContent />
                          <LayoutFooter />
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
