<script lang="ts" setup>
import type { RouteLocationNormalizedLoaded } from 'vue-router';

import { preference, usePreference } from '@vben/preference';
import { storeToRefs, useTabsStore } from '@vben/stores';

import { IFrameRouterView } from '../../iframe';

defineOptions({ name: 'LayoutContent' });

const { keepAlive } = usePreference();

const tabsStore = useTabsStore();
const { getCacheTabs, getExcludeTabs, renderRouteView } =
  storeToRefs(tabsStore);

// 页面切换动画
function getTransitionName(route: RouteLocationNormalizedLoaded) {
  // 如果偏好设置未设置，则不使用动画
  const { keepAlive, pageTransition, pageTransitionEnable, tabsVisible } =
    preference;
  if (!pageTransition || !pageTransitionEnable) {
    return;
  }

  // 标签页未启用或者未开启缓存，则使用全局配置动画
  if (!tabsVisible || !keepAlive) {
    return pageTransition;
  }

  // 如果页面已经加载过，则不使用动画
  if (route.meta.loaded) {
    return;
  }
  // 已经打开且已经加载过的页面不使用动画
  const inTabs = getCacheTabs.value.includes(route.name as string);
  return inTabs && route.meta.loaded ? undefined : pageTransition;
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
          :key="route.fullPath"
          class="h-[1000px]"
        />
      </KeepAlive>
      <component :is="Component" v-else :key="route.fullPath" />
    </Transition>
  </RouterView>
</template>
