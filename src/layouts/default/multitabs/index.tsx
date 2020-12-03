import './index.less';

import type { TabContentProps } from './types';

import { defineComponent, watch, computed, unref, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Tabs } from 'ant-design-vue';
import TabContent from './TabContent';

import { useGo } from '/@/hooks/web/usePage';

import { TabContentEnum } from './types';

import { tabStore } from '/@/store/modules/tab';
import { userStore } from '/@/store/modules/user';

import { initAffixTabs, useTabsDrag } from './useMultipleTabs';

export default defineComponent({
  name: 'MultipleTabs',
  setup() {
    const activeKeyRef = ref('');

    const affixTextList = initAffixTabs();

    useTabsDrag(affixTextList);

    const go = useGo();

    const { currentRoute } = useRouter();

    const getTabsState = computed(() => tabStore.getTabsState);

    watch(
      () => tabStore.getLastChangeRouteState?.path,
      () => {
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
      tabStore.closeTabByKeyAction(targetKey);
    }

    function renderQuick() {
      const tabContentProps: TabContentProps = {
        tabItem: currentRoute.value,
        type: TabContentEnum.EXTRA_TYPE,
      };
      return <TabContent {...tabContentProps} />;
    }

    function renderTabs() {
      return unref(getTabsState).map((item) => {
        const key = item.query ? item.fullPath : item.path;
        const closable = !(item && item.meta && item.meta.affix);

        const slots = {
          tab: () => <TabContent tabItem={item} />,
        };
        return (
          <Tabs.TabPane key={key} closable={closable}>
            {slots}
          </Tabs.TabPane>
        );
      });
    }

    return () => {
      const slots = {
        default: () => renderTabs(),
        tabBarExtraContent: () => renderQuick(),
      };
      return (
        <div class="multiple-tabs">
          <Tabs
            type="editable-card"
            size="small"
            animated={false}
            hideAdd={true}
            tabBarGutter={3}
            activeKey={unref(activeKeyRef)}
            onChange={handleChange}
            onEdit={handleEdit}
          >
            {slots}
          </Tabs>
        </div>
      );
    };
  },
});
