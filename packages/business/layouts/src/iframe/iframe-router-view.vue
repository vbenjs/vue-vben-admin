<script lang="ts" setup>
import { Spinner } from '@vben/common-ui';
import { preference } from '@vben/preference';
import { useTabsStore } from '@vben/stores';
import { computed, ref } from 'vue';
import { type RouteLocationNormalized, useRoute } from 'vue-router';

defineOptions({ name: 'IFrameRouterView' });

const spinning = ref(true);
const tabsStore = useTabsStore();
const route = useRoute();

const iframeRoutes = computed(() => {
  if (!preference.tabsVisible) {
    return route.meta.iframeSrc ? [route] : [];
  }
  const tabs = tabsStore.getTabs.filter((tab) => !!tab.meta?.iframeSrc);
  return tabs;
});

const tabNames = computed(() => {
  const names = new Set<string>();
  iframeRoutes.value.forEach((item) => {
    names.add(item.name as string);
  });
  return names;
});

const showIframe = computed(() => iframeRoutes.value.length > 0);

function routeShow(tabItem: RouteLocationNormalized) {
  const { name } = tabItem;
  return name === route.name;
}

function canRender(tabItem: RouteLocationNormalized) {
  const { meta, name } = tabItem;

  if (!name) {
    return false;
  }

  if (!tabsStore.renderRouteView) {
    return false;
  }

  if (!preference.tabsVisible) {
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
  return tabsStore.getTabs.findIndex((tab) => tab.name === name) !== -1;
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
