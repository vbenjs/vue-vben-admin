<script lang="ts" setup>
import type {
  RouteLocationNormalizedLoaded,
  RouteLocationNormalizedLoadedGeneric,
} from 'vue-router';

import { type VNode } from 'vue';
import { RouterView } from 'vue-router';

import { useContentHeight } from '@vben/hooks';
import { preferences, usePreferences } from '@vben/preferences';
import { storeToRefs, useTabbarStore } from '@vben/stores';
import { Spinner } from '@vben-core/shadcn-ui';

import { IFrameRouterView } from '../../iframe';
import { useContentSpinner } from './use-content-spinner';

defineOptions({ name: 'LayoutContent' });

const tabbarStore = useTabbarStore();
const { keepAlive } = usePreferences();
const { spinning } = useContentSpinner();
const { contentStyles } = useContentHeight();

const { getCachedTabs, getExcludeCachedTabs, renderRouteView } =
  storeToRefs(tabbarStore);

// 页面切换动画
function getTransitionName(_route: RouteLocationNormalizedLoaded) {
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
  // const inTabs = getCachedTabs.value.includes(route.name as string);

  // return inTabs && route.meta.loaded ? undefined : transitionName;
  return transitionName;
}

/**
 * 转换组件，自动添加 name
 * @param component
 */
function transformComponent(
  component: VNode,
  route: RouteLocationNormalizedLoadedGeneric,
) {
  const routeName = route.name as string;
  // 如果组件没有 name，则直接返回
  if (!routeName) {
    return component;
  }

  const componentName = (component.type as any).name;

  // 已经设置过 name，则直接返回
  if (componentName) {
    return component;
  }

  // componentName 与 routeName 一致，则直接返回
  if (componentName === routeName) {
    return component;
  }

  // 设置 name
  component.type ||= {};
  (component.type as any).name = routeName;

  return component;
}
</script>

<template>
  <div class="relative h-full">
    <Spinner
      v-if="preferences.transition.loading"
      :spinning="spinning"
      :style="contentStyles"
    />
    <IFrameRouterView />
    <RouterView v-slot="{ Component, route }">
      <Transition :name="getTransitionName(route)" appear mode="out-in">
        <KeepAlive
          v-if="keepAlive"
          :exclude="getExcludeCachedTabs"
          :include="getCachedTabs"
        >
          <component
            :is="transformComponent(Component, route)"
            v-if="renderRouteView"
            v-show="!route.meta.iframeSrc"
            :key="route.fullPath"
          />
        </KeepAlive>
        <component
          :is="Component"
          v-else-if="renderRouteView"
          :key="route.fullPath"
        />
      </Transition>
    </RouterView>
  </div>
</template>
