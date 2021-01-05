import type { DefaultContext } from './transition';

import { computed, defineComponent, unref, Transition, KeepAlive } from 'vue';
import { RouterView } from 'vue-router';

import FrameLayout from '/@/layouts/iframe/index.vue';

import { useRootSetting } from '/@/hooks/setting/useRootSetting';

import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
import { useCache } from './useCache';
import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
import { getTransitionName } from './transition';

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

                const name = getTransitionName({
                  route,
                  openCache: unref(openCache),
                  enableTransition: unref(getEnableTransition),
                  cacheTabs,
                  def: unref(getBasicTransition),
                });

                // When the child element is the parentView, adding the key will cause the component to be executed multiple times. When it is not parentView, you need to add a key, because it needs to be compatible with the same route carrying different parameters
                const isParentView = Component?.type.parentView;
                const componentKey = isParentView ? {} : { key: route.fullPath };

                const renderComp = () => <Component {...componentKey} />;

                const PageContent = unref(openCache) ? (
                  <KeepAlive include={cacheTabs}>{renderComp()}</KeepAlive>
                ) : (
                  renderComp()
                );

                if (!unref(getEnableTransition)) {
                  return PageContent;
                }
                return (
                  <Transition name={name} mode="out-in" appear={true}>
                    {() => PageContent}
                  </Transition>
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
