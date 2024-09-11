<template>
  <div :class="getWrapClass">
    <Tabs
      type="editable-card"
      size="small"
      :animated="false"
      :hideAdd="true"
      :tabBarGutter="3"
      :activeKey="activeKeyRef"
      @change="handleChange"
      @edit="(e) => handleEdit(`${e}`)"
    >
      <template v-for="item in getTabsState" :key="item.query ? item.fullPath : item.path">
        <Tabs.TabPane :closable="!(item && item.meta && item.meta.affix)">
          <template #tab>
            <TabContent :tabItem="item" />
          </template>
        </Tabs.TabPane>
      </template>

      <template #rightExtra v-if="getShowRedo || getShowQuick">
        <SettingButton v-if="(getShowFold && getIsUnFold) || !getShowHeader" />
        <TabRedo v-if="getShowRedo" />
        <TabContent isExtra :tabItem="$route" v-if="getShowQuick" />
        <FoldButton v-if="getShowFold" />
      </template>
    </Tabs>
  </div>
</template>
<script lang="ts" setup>
  import type { RouteLocationNormalized, RouteMeta } from 'vue-router';

  import { computed, unref, ref } from 'vue';

  import { Tabs } from 'ant-design-vue';
  import TabContent from './components/TabContent.vue';
  import FoldButton from './components/FoldButton.vue';
  import TabRedo from './components/TabRedo.vue';

  import { useGo } from '@/hooks/web/usePage';

  import { useMultipleTabStore } from '@/store/modules/multipleTab';
  import { useUserStore } from '@/store/modules/user';

  import { initAffixTabs, useTabsDrag } from './useMultipleTabs';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting';

  import { REDIRECT_NAME } from '@/router/constant';
  import { listenerRouteChange } from '@/logics/mitt/routeChange';

  import { useRouter } from 'vue-router';

  import { useMouse } from '@vueuse/core';
  import { multipleTabHeight } from '@/settings/designSetting';

  import SettingButton from './components/SettingButton.vue';
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';

  defineOptions({ name: 'MultipleTabs' });

  const affixTextList = initAffixTabs();
  const activeKeyRef = ref('');

  useTabsDrag(affixTextList);
  const tabStore = useMultipleTabStore();
  const userStore = useUserStore();
  const router = useRouter();

  const { prefixCls } = useDesign('multiple-tabs');
  const go = useGo();
  const { getShowQuick, getShowRedo, getShowFold } = useMultipleTabSetting();

  const getTabsState = computed(() => {
    return tabStore.getTabList.filter((item) => !item.meta?.hideTab);
  });

  const unClose = computed(() => unref(getTabsState).length === 1);

  const { y: mouseY } = useMouse();

  const { getShowMenu } = useMenuSetting();
  const { getShowHeader } = useHeaderSetting();
  const getIsUnFold = computed(() => !unref(getShowMenu) && !unref(getShowHeader));

  const getWrapClass = computed(() => {
    return [
      prefixCls,
      {
        [`${prefixCls}--hide-close`]: unref(unClose),
        [`${prefixCls}--hover`]: unref(mouseY) < multipleTabHeight,
      },
    ];
  });

  listenerRouteChange((route) => {
    const { name } = route;
    if (name === REDIRECT_NAME || !route || !userStore.getToken) {
      return;
    }

    const { path, fullPath, meta = {} } = route;
    const { currentActiveMenu, hideTab } = meta as RouteMeta;
    const isHide = !hideTab ? null : currentActiveMenu;
    const p = isHide || fullPath || path;
    if (activeKeyRef.value !== p) {
      activeKeyRef.value = p as string;
    }

    if (isHide) {
      const findParentRoute = router.getRoutes().find((item) => item.path === currentActiveMenu);

      findParentRoute && tabStore.addTab(findParentRoute as unknown as RouteLocationNormalized);
    } else {
      tabStore.addTab(unref(route));
    }
  });

  function handleChange(activeKey: any) {
    activeKeyRef.value = activeKey;
    go(activeKey, false);
  }

  // Close the current tab
  function handleEdit(targetKey: string) {
    // Added operation to hide, currently only use delete operation
    if (unref(unClose)) {
      return;
    }

    tabStore.closeTabByKey(targetKey, router);
  }
</script>
<style lang="less">
  @import url('./index.less');
</style>
