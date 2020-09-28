import { computed, defineComponent, unref, Transition, KeepAlive, toRaw } from 'vue';

import { appStore } from '/@/store/modules/app';

import { useTransition } from './useTransition';

import { RouterView, RouteLocation } from 'vue-router';
import { tabStore } from '/@/store/modules/tab';
import FrameLayout from '/@/layouts/iframe/index.vue';

import { useSetting } from '/@/hooks/core/useSetting';
// import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'PageLayout',
  setup() {
    // const { currentRoute } = useRouter();
    const getProjectConfigRef = computed(() => {
      return appStore.getProjectConfig;
    });
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
        openKeepAlive,
        multiTabsSetting: { show, max },
      } = unref(getProjectConfigRef);

      const openCache = openKeepAlive && show;
      const cacheTabs = toRaw(tabStore.getKeepAliveTabsState) as string[];
      return (
        <div>
          <RouterView>
            {{
              default: ({ Component, route }: { Component: any; route: RouteLocation }) => {
                const Content = openCache ? (
                  <KeepAlive max={max} include={cacheTabs}>
                    <Component {...route.params} />
                  </KeepAlive>
                ) : (
                  <Component {...route.params} />
                );
                return openRouterTransition ? (
                  <Transition
                    {...on}
                    name={route.meta.transitionName || routerTransition}
                    mode="out-in"
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
