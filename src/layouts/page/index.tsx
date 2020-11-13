import { computed, defineComponent, unref, Transition, KeepAlive, toRaw } from 'vue';
import { RouterView, RouteLocation } from 'vue-router';

import FrameLayout from '/@/layouts/iframe/index.vue';

import { useTransition } from './useTransition';
import { useSetting } from '/@/hooks/core/useSetting';

import { tabStore } from '/@/store/modules/tab';
import { appStore } from '/@/store/modules/app';

export default defineComponent({
  name: 'PageLayout',
  setup() {
    const getProjectConfigRef = computed(() => appStore.getProjectConfig);
    const openCacheRef = computed(() => {
      const {
        openKeepAlive,
        multiTabsSetting: { show },
      } = unref(getProjectConfigRef);
      return openKeepAlive && show;
    });
    const getCacheTabsRef = computed(() => toRaw(tabStore.getKeepAliveTabsState) as string[]);

    const { openPageLoading } = unref(getProjectConfigRef);

    let on = {};
    if (openPageLoading) {
      const { on: transitionOn } = useTransition();
      on = transitionOn;
    }
    const { projectSetting } = useSetting();
    return () => {
      const {
        routerTransition,
        openRouterTransition,
        multiTabsSetting: { max },
      } = unref(getProjectConfigRef);

      return (
        <div>
          <RouterView>
            {{
              default: ({ Component, route }: { Component: any; route: RouteLocation }) => {
                // No longer show animations that are already in the tab
                const cacheTabs = unref(getCacheTabsRef);
                const isInCache = cacheTabs.includes(route.name as string);
                const name = isInCache && route.meta.inTab ? 'fade' : null;

                const Content = unref(openCacheRef) ? (
                  <KeepAlive max={max} include={cacheTabs}>
                    <Component key={route.fullPath} />
                  </KeepAlive>
                ) : (
                  <Component key={route.fullPath} />
                );
                return openRouterTransition ? (
                  <Transition
                    {...on}
                    name={name || route.meta.transitionName || routerTransition}
                    mode="out-in"
                    appear={true}
                  >
                    {() => Content}
                  </Transition>
                ) : (
                  Content
                );
              },
            }}
          </RouterView>
          {projectSetting.canEmbedIFramePage && <FrameLayout />}
        </div>
      );
    };
  },
});
