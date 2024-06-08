<script lang="ts" setup>
import { computed, ref } from 'vue';
import { type RouteLocationNormalized, useRoute } from 'vue-router';

import { Spinner } from '@vben/common-ui';
import { preferences } from '@vben-core/preferences';
import { useTabsStore } from '@vben-core/stores';

defineOptions({ name: 'IFrameRouterView' });

const spinning = ref(true);
const tabsStore = useTabsStore();
const route = useRoute();

const enableTabbar = computed(() => preferences.tabbar.enable);

const iframeRoutes = computed(() => {
  if (!enableTabbar.value) {
    return route.meta.iframeSrc ? [route] : [];
  }
  return tabsStore.getTabs.filter((tab) => !!tab.meta?.iframeSrc);
});

const tabNames = computed(
  () => new Set(iframeRoutes.value.map((item) => item.name as string)),
);

const showIframe = computed(() => iframeRoutes.value.length > 0);

function routeShow(tabItem: RouteLocationNormalized) {
  return tabItem.name === route.name;
}

function canRender(tabItem: RouteLocationNormalized) {
  const { meta, name } = tabItem;

  if (!name || !tabsStore.renderRouteView) {
    return false;
  }

  if (!enableTabbar.value) {
    return routeShow(tabItem);
  }

  // 跟随 keepAlive 状态,与其他tab页保持一致
  if (
    !meta?.keepAlive &&
    tabNames.value.has(name as string) &&
    name !== route.name
  ) {
    return false;
  }
  return tabsStore.getTabs.some((tab) => tab.name === name);
}

function hideLoading() {
  spinning.value = false;
}
</script>
<template>
  <template v-if="showIframe">
    <template v-for="item in iframeRoutes" :key="item.fullPath">
      <div
        v-show="routeShow(item)"
        v-if="canRender(item)"
        class="relative size-full"
      >
        <Spinner :spinning="spinning" />
        <iframe
          :src="item.meta.iframeSrc as string"
          class="size-full"
          @load="hideLoading"
        ></iframe>
      </div>
    </template>
  </template>
</template>
