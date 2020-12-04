import type { FunctionalComponent } from 'vue';

import { computed, defineComponent, unref, Transition, KeepAlive } from 'vue';
import { RouterView, RouteLocation } from 'vue-router';

import FrameLayout from '/@/layouts/iframe/index.vue';

import { useRootSetting } from '/@/hooks/setting/useRootSetting';

import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
import { useCache } from './useCache';
import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';

interface DefaultContext {
  Component: FunctionalComponent;
  route: RouteLocation;
}

export default defineComponent({
  name: 'PageLayout',
  setup() {
    const { getCaches } = useCache(true);
    const { getShowMultipleTab } = useMultipleTabSetting();

    const { getOpenKeepAlive, getCanEmbedIFramePage } = useRootSetting();

    const { getBasicTransition, getEnableTransition } = useTransitionSetting();

    const openCache = computed(() => unref(getOpenKeepAlive) && unref(getShowMultipleTab));

    return () => {
      return (
        <>
          <RouterView>
            {{
              default: ({ Component, route }: DefaultContext) => {
                // No longer show animations that are already in the tab
                const cacheTabs = unref(getCaches);
                const isInCache = cacheTabs.includes(route.name as string);
                const name =
                  isInCache && route.meta.loaded && unref(getEnableTransition)
                    ? 'fade-slide'
                    : null;

                const renderComp = () => <Component key={route.fullPath} />;

                const PageContent = unref(openCache) ? (
                  <KeepAlive>{renderComp()}</KeepAlive>
                ) : (
                  renderComp()
                );

                return unref(getEnableTransition) ? (
                  <Transition
                    name={name || route.meta.transitionName || unref(getBasicTransition)}
                    mode="out-in"
                    appear={true}
                  >
                    {() => PageContent}
                  </Transition>
                ) : (
                  PageContent
                );
              },
            }}
          </RouterView>
          {unref(getCanEmbedIFramePage) && <FrameLayout />}
        </>
      );
    };
  },
});
