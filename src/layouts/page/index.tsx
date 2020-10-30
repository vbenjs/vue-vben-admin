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
                // 已经位于tab内的不再显示动画
                const name = route.meta.inTab ? 'fade' : null;
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
