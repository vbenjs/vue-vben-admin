<script lang="ts" setup>
import type { RouteLocationNormalizedLoaded } from 'vue-router';

import { preferences, usePreferences } from '@vben-core/preferences';
import { Spinner } from '@vben-core/shadcn-ui';
import { storeToRefs, useTabsStore } from '@vben-core/stores';

import { IFrameRouterView } from '../../iframe';
import { useContentSpinner } from './use-content-spinner';

defineOptions({ name: 'LayoutContent' });

const tabsStore = useTabsStore();
const { keepAlive } = usePreferences();
const { spinning } = useContentSpinner();

const { getCacheTabs, getExcludeTabs, renderRouteView } =
  storeToRefs(tabsStore);

// 页面切换动画
function getTransitionName(route: RouteLocationNormalizedLoaded) {
  // 如果偏好设置未设置，则不使用动画
  const { tabbar, transition } = preferences;
  const transitionName = transition.name;
  if (!transitionName || !transition.enable) {
    return;
  }

  // 标签页未启用或者未开启缓存，则使用全局配置动画
  if (!tabbar.enable || !keepAlive) {
    return transitionName;
  }

  // 如果页面已经加载过，则不使用动画
  // if (route.meta.loaded) {
  //   return;
  // }
  // 已经打开且已经加载过的页面不使用动画
  const inTabs = getCacheTabs.value.includes(route.name as string);

  return inTabs && route.meta.loaded ? undefined : transitionName;
}
</script>

<template>
  <div class="relative h-full">
    <Spinner
      v-if="preferences.transition.loading"
      :spinning="spinning"
      class="h-[var(--vben-content-client-height)]"
    />
    <IFrameRouterView />
    <RouterView v-slot="{ Component, route }">
      <Transition :name="getTransitionName(route)" appear mode="out-in">
        <KeepAlive
          v-if="keepAlive"
          :exclude="getExcludeTabs"
          :include="getCacheTabs"
        >
          <component
            :is="Component"
            v-if="renderRouteView"
            v-show="!route.meta.iframeSrc"
            :key="route.fullPath"
          />
        </KeepAlive>
        <component :is="Component" v-else :key="route.fullPath" />
      </Transition>
    </RouterView>
  </div>
</template>
