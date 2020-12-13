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
      @edit="handleEdit"
    >
      <template v-for="item in getTabsState" :key="item.query ? item.fullPath : item.path">
        <TabPane :closable="!(item && item.meta && item.meta.affix)">
          <template #tab>
            <TabContent :tabItem="item" />
          </template>
        </TabPane>
      </template>
      <template #tabBarExtraContent>
        <QuickButton />
      </template>
    </Tabs>
  </div>
</template>
<script lang="ts">
  import { defineComponent, watch, computed, unref, ref } from 'vue';

  import { Tabs } from 'ant-design-vue';
  import TabContent from './components/TabContent.vue';

  import { useGo } from '/@/hooks/web/usePage';

  import { tabStore } from '/@/store/modules/tab';
  import { userStore } from '/@/store/modules/user';

  import { initAffixTabs, useTabsDrag } from './useMultipleTabs';
  import { REDIRECT_NAME } from '/@/router/constant';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

  export default defineComponent({
    name: 'MultipleTabs',
    components: {
      QuickButton: createAsyncComponent(() => import('./components/QuickButton.vue')),
      Tabs,
      TabPane: Tabs.TabPane,
      TabContent,
    },
    setup() {
      const affixTextList = initAffixTabs();

      const activeKeyRef = ref('');

      useTabsDrag(affixTextList);
      const { prefixCls } = useDesign('multiple-tabs');
      const go = useGo();

      const getTabsState = computed(() => tabStore.getTabsState);

      const unClose = computed(() => {
        return getTabsState.value.length === 1;
      });

      const getWrapClass = computed(() => {
        return [
          prefixCls,
          {
            [`${prefixCls}--hide-close`]: unClose,
          },
        ];
      });

      watch(
        () => tabStore.getLastChangeRouteState?.path,
        () => {
          if (tabStore.getLastChangeRouteState?.name === REDIRECT_NAME) {
            return;
          }
          const lastChangeRoute = unref(tabStore.getLastChangeRouteState);
          if (!lastChangeRoute || !userStore.getTokenState) return;

          const { path, fullPath } = lastChangeRoute;
          const p = fullPath || path;

          if (activeKeyRef.value !== p) {
            activeKeyRef.value = p;
          }

          tabStore.addTabAction(lastChangeRoute);
        },
        {
          immediate: true,
        }
      );

      function handleChange(activeKey: any) {
        activeKeyRef.value = activeKey;
        go(activeKey, false);
      }

      // Close the current tab
      function handleEdit(targetKey: string) {
        // Added operation to hide, currently only use delete operation
        if (unref(unClose)) return;

        tabStore.closeTabByKeyAction(targetKey);
      }
      return {
        prefixCls,
        unClose,
        getWrapClass,
        handleEdit,
        handleChange,
        activeKeyRef,
        getTabsState,
      };
    },
  });
</script>
<style lang="less">
  @import './index.less';
</style>
