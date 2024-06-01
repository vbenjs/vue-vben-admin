<script lang="ts" setup>
import { preferences, usePreferences } from '@vben-core/preferences';
import { storeToRefs, useTabsStore } from '@vben-core/stores';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

import { IFrameRouterView } from '../../iframe';

defineOptions({ name: 'LayoutContent' });

const { keepAlive } = usePreferences();

const tabsStore = useTabsStore();
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
  if (route.meta.loaded) {
    return;
  }
  // 已经打开且已经加载过的页面不使用动画
  const inTabs = getCacheTabs.value.includes(route.name as string);
  return inTabs && route.meta.loaded ? undefined : transitionName;
}
</script>

<template>
  <IFrameRouterView />
  <RouterView v-slot="{ Component, route }">
    <Transition :name="getTransitionName(route)" mode="out-in" appear>
      <KeepAlive
        v-if="keepAlive"
        :include="getCacheTabs"
        :exclude="getExcludeTabs"
      >
        <component
          :is="Component"
          v-if="renderRouteView"
          v-show="!route.meta.iframeSrc"
          :key="route.fullPath"
          class="h-[1000px]"
        />
      </KeepAlive>
      <component :is="Component" v-else :key="route.fullPath" />
    </Transition>
  </RouterView>
</template>
